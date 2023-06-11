import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication/authentication.service';
import { School42AuthService } from './authentication/social/school42-auth.service';
import { School42AuthController } from './authentication/social/school-42-auth.controller';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationController } from './authentication/authentication.controller';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { OtpAuthenticationService } from './authentication/otp/otp-authentication.service';
import { AccessTokenWithout2faGuard } from './authentication/guards/access-token-without-2fa.guard';
import { OtpAuthenticationController } from './authentication/otp/otp-authentication.controller';
import { OtpSecretsStorage } from './authentication/otp/otp-secrets.storage';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([User]),
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
  ],
  controllers: [
    School42AuthController,
    AuthenticationController,
    OtpAuthenticationController,
  ],
})
export class IamModule {}
