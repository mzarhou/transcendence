import { createZodDto } from 'nestjs-zod';
import { updateGroupSchema } from '@transcendence/db';

export class UpdateGroupDto extends createZodDto(updateGroupSchema) {}
