import { createZodDto } from 'nestjs-zod';
import { updateGroupSchema } from '@transcendence/common';

export class UpdateGroupDto extends createZodDto(updateGroupSchema) {}
