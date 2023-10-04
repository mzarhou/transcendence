import { inviteUserToGroupSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class CreateGroupInvitationDto extends createZodDto(
  inviteUserToGroupSchema,
) {}
