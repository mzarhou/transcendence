import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import z from 'zod';
import { AuthenticationService } from '../authentication.service';
import { School42AuthDto } from '../dto/school-42-token.dto';

export const userSchema = z.object({
  id: z.number(),
  email: z.string().min(1),
  login: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  image: z.object({
    link: z.string(),
    versions: z.object({
      large: z.string(),
      medium: z.string(),
      small: z.string(),
      micro: z.string(),
    }),
  }),
});

@Injectable()
export class School42AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthenticationService,
  ) {}

  async authenticate(
    { accessToken }: School42AuthDto,
    fingerprintHash: string,
  ) {
    try {
      const school42User = await this.get42User(accessToken);

      const user = await this.userRepository.findOneBy({
        school42Id: school42User.id,
      });

      if (user) {
        return this.authService.generateTokens(user, fingerprintHash);
      } else {
        const user = new User();
        user.name = school42User.login;
        user.avatar = school42User.image.link;
        user.email = school42User.email;
        user.school42Id = school42User.id;
        await this.userRepository.save(user);
        return this.authService.generateTokens(user, fingerprintHash);
      }
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if ((error as any)?.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw new UnauthorizedException();
    }
  }

  private async get42User(accessToken: string) {
    const { data: user } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return userSchema.parse(user);
  }
}
