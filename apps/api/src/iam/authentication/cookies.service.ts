import { Injectable } from '@nestjs/common';
import { env } from '@src/+env/server';
import { CookieOptions, Response } from 'express';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../iam.constants';

@Injectable()
export class CookiesService {
  private readonly cookieConfig: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.FRONTEND_URL.startsWith('https'),
    domain: env.COOKIES_DOMAIN,
  };

  setCookies(
    response: Response,
    {
      accessToken,
      refreshToken,
    }: {
      [REFRESH_TOKEN_KEY]: string;
      [ACCESS_TOKEN_KEY]: string;
    },
    options?: { maxAge?: number },
  ) {
    response.cookie(ACCESS_TOKEN_KEY, accessToken, {
      ...this.cookieConfig,
      maxAge: options?.maxAge ?? env.JWT_ACCESS_TOKEN_TTL * 1000,
    });
    response.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      ...this.cookieConfig,
      maxAge: options?.maxAge ?? env.JWT_REFRESH_TOKEN_TTL * 1000,
    });
    return response;
  }
}
