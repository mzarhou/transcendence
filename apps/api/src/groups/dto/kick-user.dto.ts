import { kickUserSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class KickUserDto extends createZodDto(kickUserSchema) {}
