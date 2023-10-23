import { createGameInivationSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class CreateGameInvitationDto extends createZodDto(
  createGameInivationSchema,
) {}
