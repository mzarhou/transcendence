import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication/authentication.service';
import { School42AuthService } from './authentication/social/school42-auth.service';
import { School42AuthController } from './authentication/social/school-42-auth.controller';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [AuthenticationService, School42AuthService],
  controllers: [School42AuthController],
})
export class IamModule {}
