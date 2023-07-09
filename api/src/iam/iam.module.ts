import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
import { School42AuthService } from './authentication/social/school42-auth.service';
import { School42AuthController } from './authentication/social/school-42-auth.controller';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { OtpAuthenticationService } from './authentication/otp/otp-authentication.service';
import { AccessTokenWithout2faGuard } from './authentication/guards/access-token-without-2fa.guard';
import { OtpAuthenticationController } from './authentication/otp/otp-authentication.controller';
import { OtpSecretsStorage } from './authentication/otp/otp-secrets.storage';
import { RedisModule } from 'src/redis/redis.module';
import { CryptoService } from './authentication/otp/crypto.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CaslExceptionFilter } from './authorization/casl-exception.filter';
import { AbilityFactory } from './authorization/ability.factory';

const Fingerprint = require('express-fingerprint');

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    AuthenticationService,
    School42AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    AccessTokenWithout2faGuard,
    RefreshTokenIdsStorage,
    OtpAuthenticationService,
    OtpSecretsStorage,
    CryptoService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AbilityFactory,
    {
      provide: APP_FILTER,
      useClass: CaslExceptionFilter,
    },
  ],
  controllers: [
    School42AuthController,
    AuthenticationController,
    OtpAuthenticationController,
  ],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        Fingerprint({
          parameters: [
            Fingerprint.useragent,
            Fingerprint.acceptHeaders,
            Fingerprint.geoip,
          ],
        }),
      )
      .forRoutes('/authentication/*');
  }
}
