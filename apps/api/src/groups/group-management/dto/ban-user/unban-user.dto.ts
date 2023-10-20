import { unBanUserSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class UnBanUserDto extends createZodDto(unBanUserSchema) {}
