import { joinGroupSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class JoinGroupDto extends createZodDto(joinGroupSchema) {}
