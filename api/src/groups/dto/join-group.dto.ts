import { joinGroupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class JoinGroupDto extends createZodDto(joinGroupSchema) {}
