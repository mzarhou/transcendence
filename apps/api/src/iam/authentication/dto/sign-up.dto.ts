import { signupSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class SignUpDto extends createZodDto(signupSchema) {}
