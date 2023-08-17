import { banUserSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class BanUserDto extends createZodDto(banUserSchema) {}
