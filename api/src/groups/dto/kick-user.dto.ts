import { kickUserSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class KickUserDto extends createZodDto(kickUserSchema) {}
