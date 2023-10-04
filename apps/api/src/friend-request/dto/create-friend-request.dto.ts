import { createFriendRequestSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class CreateFriendRequestDto extends createZodDto(
  createFriendRequestSchema,
) {}
