import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { OtpSecretsStorage } from './otp-secrets.storage';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { AuthenticationService } from '../authentication.service';
import { Provide2faCodeDto } from '../dto/provide-2fa-code.dto';
import { CryptoService } from './crypto.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly otpSecretsStorage: OtpSecretsStorage,
    private readonly authService: AuthenticationService,
    private readonly cryptoService: CryptoService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async generateSecret(activeUser: ActiveUserData) {
    const user = await this.usersService.findOne(activeUser.sub);
    if (await this.is2faEnabled(activeUser.sub)) {
      throw new UnauthorizedException(undefined, '2FA already enabled');
    }
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(user.email, appName, secret);

    const encryptedSecret = this.cryptoService.encrypt(secret);
    await this.otpSecretsStorage.insert(activeUser.sub, encryptedSecret);
    return { uri, secret };
  }

  async enableTfaForUser(activeUser: ActiveUserData, code: string) {
    const encryptedSecret = await this.otpSecretsStorage.get(activeUser.sub);
    if (!encryptedSecret) {
      throw new UnauthorizedException('You must generate qrcode first');
    }
    if (!this.verifyCode(code, encryptedSecret)) {
      throw new UnauthorizedException(`Invalid code: ${code}`);
    }

    const { id, isTfaEnabled } = await this.prisma.user.findFirstOrThrow({
      where: { id: activeUser.sub },
      select: { id: true, isTfaEnabled: true },
    });
    if (isTfaEnabled) {
      throw new UnauthorizedException(undefined, '2FA already enabled');
    }

    await this.otpSecretsStorage.invalidate(activeUser.sub);
    await this.prisma.user.update({
      where: { id },
      data: {
        tfaSecret: encryptedSecret,
        isTfaEnabled: true,
      },
    });
  }

  async disableTfaForUser(activeUser: ActiveUserData, code: string) {
    const { id, tfaSecret, isTfaEnabled } =
      await this.prisma.user.findFirstOrThrow({
        where: { id: activeUser.sub },
      });
    if (!isTfaEnabled) {
      throw new UnauthorizedException(undefined, `2FA isn't enabled`);
    }
    if (!tfaSecret || !this.verifyCode(code, tfaSecret)) {
      throw new UnauthorizedException(`Invalid code: ${code}`);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        tfaSecret: '',
        isTfaEnabled: false,
      },
    });
  }

  async provide2faCode(
    activeUser: ActiveUserData,
    provide2faCodeDto: Provide2faCodeDto,
    fingerprintHash: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: activeUser.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid =
      user.tfaSecret &&
      (await this.verifyCode(provide2faCodeDto.tfaCode, user.tfaSecret));
    if (!isValid) {
      throw new UnauthorizedException('Invalid Code');
    }
    return this.authService.generateTokens(user, fingerprintHash, true);
  }

  private verifyCode(code: string, encryptedSecret: string) {
    const secret = this.cryptoService.decrypt(encryptedSecret);
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  private async is2faEnabled(userId: number) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    return user.isTfaEnabled;
  }
}
