import { createZodDto } from 'nestjs-zod';
import { updateUserSchema } from '@transcendence/db';

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
