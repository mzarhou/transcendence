import { unBanUserSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class UnBanUserDto extends createZodDto(unBanUserSchema) {}
