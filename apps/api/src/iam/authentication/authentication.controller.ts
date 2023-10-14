import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { FPHash } from './decorators/fingerprint-hash.decorator';
import { AuthType } from './enum/auth-type.enum';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { CookiesService } from './cookies.service';
import { REFRESH_TOKEN_KEY } from '../iam.constants';

@ApiTags('authentication')
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly cookiesService: CookiesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @FPHash() fpHash: string,
    @Body() signInDto: SignInDto,
  ) {
    const tokens = await this.authService.signIn(signInDto, fpHash);
    this.cookiesService.setCookies(response, tokens).json({ success: true });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(
    @FPHash() fpHash: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_KEY] as
      | string
      | undefined;
    if (!refreshToken) {
      throw new ForbiddenException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken, fpHash);
    this.cookiesService.setCookies(response, tokens).json({ success: true });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.cookiesService.setCookies(
      response,
      {
        accessToken: '',
        refreshToken: '',
      },
      { maxAge: -1 },
    );
  }
}
