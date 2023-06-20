import { createZodDto } from 'nestjs-zod';
import { updateUserSchema } from '@transcendence/types';

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
