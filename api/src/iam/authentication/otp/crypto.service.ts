import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  encrypt(str: string) {
    return CryptoJS.AES.encrypt(
      str,
      this.configService.getOrThrow<string>('APP_SECRET'),
    ).toString();
  }

  decrypt(encrypted: string) {
    const bytes = CryptoJS.AES.decrypt(
      encrypted,
      this.configService.getOrThrow<string>('APP_SECRET'),
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
