import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import z from 'zod';
import { AuthenticationService } from '../authentication.service';
import { School42AuthDto } from '../dto/school-42-token.dto';
import { Prisma } from '@prisma/client';
import { UsersRepository } from '@src/users/repositories/users.repository';
import { faker } from '@faker-js/faker';
import { env } from '@src/+env/server';

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

export const tokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type TokensResponse = z.infer<typeof tokensResponseSchema>;

@Injectable()
export class School42AuthService {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async callback(data: { code: string; fingerprintHash: string }) {
    const accessToken = await this.getAccessToken(data.code);
    if (!accessToken) {
      throw new ForbiddenException('Invalid 42 access token');
    }
    return this.authenticate({ accessToken }, data.fingerprintHash);
  }

  getLoginRedirectUrl() {
    const authorizeUrlParams = new URLSearchParams();
    authorizeUrlParams.set('client_id', env.CLIENT_ID_42);
    authorizeUrlParams.set('scope', 'public');
    authorizeUrlParams.set(
      'redirect_uri',
      `${env.BACKEND_URL}/authentication/school-42/callback`,
    );
    authorizeUrlParams.set('response_type', 'code');
    return `https://api.intra.42.fr/oauth/authorize?${authorizeUrlParams}`;
  }

  private async getAccessToken(code: string): Promise<string | null> {
    try {
      const { data: authData } = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: env.CLIENT_ID_42,
          client_secret: env.CLIENT_SECRET_42,
          redirect_uri: `${env.BACKEND_URL}/authentication/school-42/callback`,
          code,
        },
      );
      return authData.access_token;
    } catch (err) {
      return null;
    }
  }

  private async authenticate(
    { accessToken }: School42AuthDto,
    fingerprintHash: string,
  ) {
    try {
      const school42User = await this.get42User(accessToken);

      const userBy42SchoolId = await this.usersRepository.findOneBy({
        school42Id: school42User.id,
      });

      if (userBy42SchoolId) {
        return this.authService.generateTokens(
          userBy42SchoolId,
          fingerprintHash,
        );
      }

      const userByEmail = await this.usersRepository.findOneBy({
        email: school42User.email,
      });

      if (userByEmail && userByEmail.school42Id) {
        throw new ForbiddenException('Invalid 42 school ID');
      }

      if (userByEmail) {
        const updatedUser = await this.usersRepository.update(userByEmail.id, {
          school42Id: school42User.id,
        });
        return this.authService.generateTokens(updatedUser, fingerprintHash);
      }

      const createdUser = await this.usersRepository.create({
        name: faker.internet.userName(),
        avatar: school42User.image.link,
        email: school42User.email,
        school42Id: school42User.id,
      });
      return this.authService.generateTokens(createdUser, fingerprintHash);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
      throw new ForbiddenException();
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
