import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { RefreshTokenData } from './interface/refresh-token-data.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenIdsStorage,
  RefreshTokenKey,
} from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateTokens({
    user,
    userAgent,
    deviceId,
    isTfaCodeProvided,
  }: {
    user: User;
    userAgent: string;
    deviceId?: string;
    isTfaCodeProvided?: boolean;
  }) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Omit<ActiveUserData, 'sub'>>(
        user,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          isTfaEnabled: user.isTfaEnabled,
          isTfaCodeProvided: isTfaCodeProvided ?? false,
        },
      ),
      this.signToken<Omit<RefreshTokenData, 'sub'>>(
        user,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);

    deviceId ??= randomUUID();
    await this.refreshTokenIdsStorage.insert(
      {
        userId: user.id,
        userAgent,
        deviceId,
      },
      refreshTokenId,
    );
    return { accessToken, refreshToken, deviceId };
  }

  private async signToken<T>(user: User, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto, userAgent: string) {
    try {
      const { sub, refreshTokenId } =
        await this.jwtService.verifyAsync<RefreshTokenData>(
          refreshTokenDto.refreshToken,
          this.jwtConfiguration,
        );

      const user = await this.userRepository.findOneBy({ id: sub });
      if (!user) {
        throw new UnauthorizedException();
      }

      const key: RefreshTokenKey = {
        userId: user.id,
        userAgent,
        deviceId: refreshTokenDto.deviceId,
      };

      const isValid = await this.refreshTokenIdsStorage.validate(
        key,
        refreshTokenId,
      );
      if (!isValid) {
        throw new UnauthorizedException();
      }

      await this.refreshTokenIdsStorage.invalidate(key);
      return this.generateTokens({ user, userAgent });
    } catch (error) {
      if (error instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('your refresh token might be stolen');
      }
      throw new UnauthorizedException();
    }
  }
}
