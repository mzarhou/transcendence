import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interface/active-user-data.interface';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { Enable2faDto } from './dto/enable-2fa.dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { AuthType } from './enum/auth-type.enum';
import { OtpAuthenticationService } from './tfa/otp-authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Get('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { uri } = await this.otpAuthService.generateSecret(activeUser);
    response.type('png');
    return toFileStream(response, uri);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/enable')
  async enable2FA(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() enable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.enableTfaForUser(
      activeUser,
      enable2faDto.tfaCode,
    );
  }

  @Auth(AuthType.BearerWithou2fa)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/code')
  async provide2faCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() enable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.provide2faCode(activeUser, enable2faDto.tfaCode);
  }
}
