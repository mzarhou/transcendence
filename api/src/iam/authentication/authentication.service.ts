import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { RefreshTokenData } from './interface/refresh-token-data.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenIdsStorage,
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

  async generateTokens(
    user: User,
    fingerprintHash: string,
    isTfaCodeProvided?: boolean,
  ) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Omit<ActiveUserData, 'sub'>>(
        user,
        this.jwtConfiguration.accessTokenTtl,
        {
          isTfaEnabled: user.isTfaEnabled,
          isTfaCodeProvided: isTfaCodeProvided ?? false,
        },
      ),
      this.signToken<Omit<RefreshTokenData, 'sub'>>(
        user,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
          isTfaCodeProvided: isTfaCodeProvided ?? false,
        },
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(
      user.id,
      fingerprintHash,
      refreshTokenId,
    );
    return { accessToken, refreshToken };
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

  async refreshTokens(refreshToken: string, fingerprintHash: string) {
    try {
      const { sub, refreshTokenId, isTfaCodeProvided } =
        await this.jwtService.verifyAsync<RefreshTokenData>(
          refreshToken,
          this.jwtConfiguration,
        );

      const user = await this.userRepository.findOneBy({ id: sub });
      if (!user) {
        throw new UnauthorizedException();
      }

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        fingerprintHash,
        refreshTokenId,
      );
      if (!isValid) {
        throw new UnauthorizedException(undefined, 'Invalide refresh token');
      }

      await this.refreshTokenIdsStorage.invalidate(
        user.id,
        fingerprintHash,
        refreshTokenId,
      );
      return this.generateTokens(user, fingerprintHash, isTfaCodeProvided);
    } catch (error) {
      if (error instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException(
          undefined,
          'your refresh token might be stolen',
        );
      }
      throw new UnauthorizedException();
    }
  }
}
