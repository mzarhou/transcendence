import { banUserSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class BanUserDto extends createZodDto(banUserSchema) {}
