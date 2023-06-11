import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { OtpSecretsStorage } from './otp-secrets.storage';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpSecretsStorage: OtpSecretsStorage,
    private readonly authService: AuthenticationService,
  ) {}

  async generateSecret(activeUser: ActiveUserData) {
    if (await this.is2faEnabled(activeUser.sub)) {
      throw new UnauthorizedException(undefined, '2FA already enabled');
    }
    // TODO: encrypt secret
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(activeUser.email, appName, secret);
    await this.otpSecretsStorage.insert(activeUser.sub, secret);
    return { uri, secret };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(activeUser: ActiveUserData, code: string) {
    const secret = await this.otpSecretsStorage.get(activeUser.sub);
    if (!secret) {
      throw new UnauthorizedException('You must generate qrcode first');
    }
    if (!this.verifyCode(code, secret)) {
      throw new UnauthorizedException(`Invalid code: ${code}`);
    }

    const { id, isTfaEnabled } = await this.userRepository.findOneOrFail({
      where: { email: activeUser.email },
      select: { id: true, isTfaEnabled: true },
    });
    if (isTfaEnabled) {
      throw new UnauthorizedException(undefined, '2FA already enabled');
    }

    await this.otpSecretsStorage.invalidate(activeUser.sub);

    // TODO: encrypt the secret
    await this.userRepository.update(
      { id },
      {
        tfaSecret: secret,
        isTfaEnabled: true,
      },
    );
  }

  async disableTfaForUser(activeUser: ActiveUserData, code: string) {
    const { id, tfaSecret, isTfaEnabled } =
      await this.userRepository.findOneOrFail({
        where: { id: activeUser.sub },
      });
    if (!isTfaEnabled) {
      throw new UnauthorizedException(undefined, `2FA isn't enabled`);
    }
    if (!this.verifyCode(code, tfaSecret)) {
      throw new UnauthorizedException(`Invalid code: ${code}`);
    }

    await this.userRepository.update(
      { id },
      {
        tfaSecret: '',
        isTfaEnabled: false,
      },
    );
  }

  async provide2faCode(activeUser: ActiveUserData, code: string) {
    const user = await this.userRepository.findOneBy({ id: activeUser.sub });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await this.verifyCode(code, user.tfaSecret);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Code');
    }
    return this.authService.generateTokens(user, true);
  }

  private async is2faEnabled(userId: number) {
    const user = await this.userRepository.findOneByOrFail({
      id: userId,
    });
    return user.isTfaEnabled;
  }
}
