import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { FPHash } from '../decorators/fingerprint-hash.decorator';
import { AuthType } from '../enum/auth-type.enum';
import { School42AuthService } from './school42-auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CookiesService } from '../cookies.service';
import { env } from '@src/+env/server';

@ApiTags('social-authentication')
@Auth(AuthType.None)
@Controller('authentication/school-42')
export class School42AuthController {
  constructor(
    private readonly school42AuthService: School42AuthService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post()
  async login(@Res() response: Response) {
    response.redirect(this.school42AuthService.getLoginRedirectUrl());
  }

  @Get('callback')
  async callback(
    @FPHash() fpHash: string,
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const errorSearchParam = new URLSearchParams();
    errorSearchParam.set('error', '42 authentication failed');

    if (!code || code.length === 0) {
      response.redirect(env.FRONTEND_URL + `/login?${errorSearchParam}`);
      return;
    }

    try {
      const tokens = await this.school42AuthService.callback({
        code,
        fingerprintHash: fpHash,
      });
      this.cookiesService
        .setCookies(response, tokens)
        .redirect(env.FRONTEND_URL + '/game-chat');
    } catch (error) {
      response.redirect(env.FRONTEND_URL + `/login?${errorSearchParam}`);
    }
  }
}
