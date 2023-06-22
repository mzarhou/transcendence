import { signupSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class SignUpDto extends createZodDto(signupSchema) {}
