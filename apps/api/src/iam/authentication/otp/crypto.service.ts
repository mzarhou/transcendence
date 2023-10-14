import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { env } from '@src/+env/server';

@Injectable()
export class CryptoService {
  encrypt(str: string) {
    return CryptoJS.AES.encrypt(str, env.APP_SECRET).toString();
  }

  decrypt(encrypted: string) {
    const bytes = CryptoJS.AES.decrypt(encrypted, env.APP_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
