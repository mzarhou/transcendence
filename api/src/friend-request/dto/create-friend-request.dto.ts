import { createFriendRequestSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class CreateFriendRequestDto extends createZodDto(
  createFriendRequestSchema,
) {}
