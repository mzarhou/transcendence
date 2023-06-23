import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import z from 'zod';
import { AuthenticationService } from '../authentication.service';
import { School42AuthDto } from '../dto/school-42-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export const user42Schema = z.object({
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
    private readonly authService: AuthenticationService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticate(
    { accessToken }: School42AuthDto,
    fingerprintHash: string,
  ) {
    try {
      const school42User = await this.get42User(accessToken);

      const user = await this.prisma.user.findFirst({
        where: { school42Id: school42User.id },
      });

      if (user) {
        return this.authService.generateTokens(user, fingerprintHash);
      } else {
        const user = await this.prisma.user.create({
          data: {
            name: school42User.login,
            avatar: school42User.image.link,
            email: school42User.email,
            school42Id: school42User.id,
          },
        });
        return this.authService.generateTokens(user, fingerprintHash);
      }
    } catch (error) {
      // TODO: handle UniqueViolationError
      // const pgUniqueViolationErrorCode = '23505';
      // if ((error as any)?.code === pgUniqueViolationErrorCode) {
      //   throw new ConflictException();
      // }
      throw new UnauthorizedException();
    }
  }

  private async get42User(accessToken: string) {
    const { data: user } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return user42Schema.parse(user);
  }
}
