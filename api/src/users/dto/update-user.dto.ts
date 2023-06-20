import { createZodDto } from 'nestjs-zod';
import { updateUserSchema } from '@transcendence/common';

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
