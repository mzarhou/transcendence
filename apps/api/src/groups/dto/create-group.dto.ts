import { createGroupSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class CreateGroupDto extends createZodDto(createGroupSchema) {}
