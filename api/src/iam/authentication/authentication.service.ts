import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { RefreshTokenData } from './interface/refresh-token-data.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(signInDto: SignInDto, fingerprintHash: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: signInDto.email },
      include: {
        secrets: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException(undefined, "User doesn't exists");
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.secrets.password ?? '',
    );
    if (!isEqual) {
      throw new UnauthorizedException(undefined, "Password doesn't match");
    }
    return this.generateTokens(user, fingerprintHash);
  }

  async signUp(signUpDto: SignUpDto) {
    await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        avatar: `https://avatars.dicebear.com/api/avataaars/${signUpDto.email}.svg`,
        name: signUpDto.name,
        secrets: {
          create: {
            password: await this.hashingService.hash(signUpDto.password),
          },
        },
      },
    });
  }

  async generateTokens(
    user: User,
    fingerprintHash: string,
    isTfaCodeProvided?: boolean,
  ) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Omit<ActiveUserData, 'sub' | 'allow'>>(
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

      const user = await this.prisma.user.findFirst({ where: { id: sub } });
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
