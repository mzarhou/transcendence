import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { FPHash } from './decorators/fingerprint-hash.decorator';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { AuthType } from './enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(
    @FPHash() fpHash: string,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken, fpHash);
  }

  @Get('/fp')
  getFingerprint(@FPHash() fpHash: string) {
    return fpHash;
    1;
  }
}
