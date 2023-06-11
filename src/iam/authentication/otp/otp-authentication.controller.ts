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
import { ActiveUser } from '../../decorators/active-user.decorator';
import { ActiveUserData } from '../../interface/active-user-data.interface';
import { Auth } from '../decorators/auth.decorator';
import { Enable2faDto } from '../dto/enable-2fa.dto';
import { AuthType } from '../enum/auth-type.enum';
import { OtpAuthenticationService } from './otp-authentication.service';

@Controller('authentication/2fa')
export class OtpAuthenticationController {
  constructor(private readonly otpAuthService: OtpAuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Get('generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { uri } = await this.otpAuthService.generateSecret(activeUser);
    response.type('png');
    return toFileStream(response, uri);
  }

  @HttpCode(HttpStatus.OK)
  @Post('enable')
  async enable2FA(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() enable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.enableTfaForUser(
      activeUser,
      enable2faDto.tfaCode,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('disable')
  async disable2FA(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() disable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.disableTfaForUser(
      activeUser,
      disable2faDto.tfaCode,
    );
  }

  @Auth(AuthType.BearerWithou2fa)
  @HttpCode(HttpStatus.OK)
  @Post('code')
  async provide2faCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() enable2faDto: Enable2faDto,
  ) {
    return this.otpAuthService.provide2faCode(activeUser, enable2faDto.tfaCode);
  }
}
