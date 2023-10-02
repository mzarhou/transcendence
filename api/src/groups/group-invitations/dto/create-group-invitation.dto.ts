import { inviteUserToGroupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class CreateGroupInvitationDto extends createZodDto(
  inviteUserToGroupSchema,
) {}
