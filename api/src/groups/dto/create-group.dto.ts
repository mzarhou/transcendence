import { createGroupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class CreateGroupDto extends createZodDto(createGroupSchema) {}
