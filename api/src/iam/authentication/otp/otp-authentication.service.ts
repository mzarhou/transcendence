import { ForbiddenException, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { OtpSecretsStorage } from './otp-secrets.storage';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { AuthenticationService } from '../authentication.service';
import { Provide2faCodeDto } from '../dto/provide-2fa-code.dto';
import { CryptoService } from './crypto.service';
import { UsersService } from '@src/users/users.service';
import { env } from '@src/+env/server';
import { UsersRepository } from '@src/users/repositories/users.repository';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly otpSecretsStorage: OtpSecretsStorage,
    private readonly authService: AuthenticationService,
    private readonly cryptoService: CryptoService,
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async generateSecret(activeUser: ActiveUserData) {
    const user = await this.usersService.findOne(activeUser.sub);
    if (await this.is2faEnabled(activeUser.sub)) {
      throw new ForbiddenException('2FA already enabled');
    }
    const secret = authenticator.generateSecret();
    const appName = env.TFA_APP_NAME;
    const uri = authenticator.keyuri(user.email, appName, secret);

    const encryptedSecret = this.cryptoService.encrypt(secret);
    await this.otpSecretsStorage.insert(activeUser.sub, encryptedSecret);
    return { uri, secret };
  }

  async enableTfaForUser(
    activeUser: ActiveUserData,
    data: { code: string; fpHash: string },
  ) {
    const encryptedSecret = await this.otpSecretsStorage.get(activeUser.sub);
    if (!encryptedSecret) {
      throw new ForbiddenException('You must generate qrcode first');
    }
    if (!this.verifyCode(data.code, encryptedSecret)) {
      throw new ForbiddenException(`Invalid code: ${data.code}`);
    }

    const { id, isTfaEnabled } = await this.usersRepository.findOneOrThrow(
      activeUser.sub,
    );
    if (isTfaEnabled) {
      throw new ForbiddenException('2FA already enabled');
    }

    await this.otpSecretsStorage.invalidate(activeUser.sub);
    const user = await this.usersRepository.update(id, {
      isTfaEnabled: true,
      tfaSecret: encryptedSecret,
    });
    return this.authService.generateTokens(user, data.fpHash, true);
  }

  async disableTfaForUser(activeUser: ActiveUserData, code: string) {
    const { id, secrets, isTfaEnabled } =
      await this.usersRepository.findOneOrThrow(activeUser.sub, {
        includeSecrets: true,
      });

    if (!isTfaEnabled) {
      throw new ForbiddenException(`2FA isn't enabled`);
    }

    const tfaSecret = secrets?.tfaSecret;
    if (!tfaSecret || !this.verifyCode(code, tfaSecret)) {
      throw new ForbiddenException(`Invalid code: ${code}`);
    }

    await this.usersRepository.update(id, {
      isTfaEnabled: false,
      tfaSecret: '',
    });
  }

  async provide2faCode(
    activeUser: ActiveUserData,
    provide2faCodeDto: Provide2faCodeDto,
    fingerprintHash: string,
  ) {
    const user = await this.usersRepository.findOneOrThrow(activeUser.sub, {
      includeSecrets: true,
    });

    const isValid =
      user.secrets?.tfaSecret &&
      (await this.verifyCode(
        provide2faCodeDto.tfaCode,
        user.secrets.tfaSecret,
      ));
    if (!isValid) {
      throw new ForbiddenException('Invalid Code');
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
    const user = await this.usersRepository.findOneOrThrow(userId);
    return user.isTfaEnabled;
  }
}
