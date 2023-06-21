import { signinSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class SignInDto extends createZodDto(signinSchema) {}
