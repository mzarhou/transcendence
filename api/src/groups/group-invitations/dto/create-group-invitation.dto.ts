import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const inviteUserToGroupSchema = z.object({
  groupId: z.number().positive(),
  userId: z.number().positive(),
});
export class CreateGroupInvitationDto extends createZodDto(
  inviteUserToGroupSchema,
) {}
