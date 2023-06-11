import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { TfaSecretsStorage } from './tfa-secrets.storage';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tfaSecretsStorage: TfaSecretsStorage,
    private readonly authService: AuthenticationService,
  ) {}

  async generateSecret(activeUser: ActiveUserData) {
    // TODO: encrypt secret
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(activeUser.email, appName, secret);
    await this.tfaSecretsStorage.insert(activeUser.sub, secret);
    return { uri, secret };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(activeUser: ActiveUserData, code: string) {
    if (activeUser.isTfaEnabled) {
      throw new UnauthorizedException(undefined, '2FA already enabled');
    }
    const secret = await this.tfaSecretsStorage.get(activeUser.sub);
    if (!secret) {
      throw new UnauthorizedException('You must generate qrcode first');
    }
    if (!this.verifyCode(code, secret)) {
      throw new UnauthorizedException(`Invalid code: ${code}`);
    }

    const { id } = await this.userRepository.findOneOrFail({
      where: { email: activeUser.email },
      select: { id: true },
    });

    // TODO: encrypt the secret
    await this.userRepository.update(
      { id },
      {
        tfaSecret: secret,
        isTfaEnabled: true,
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
}
