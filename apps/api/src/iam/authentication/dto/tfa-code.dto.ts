import { createZodDto } from 'nestjs-zod';
import { enable2faSchema } from '@transcendence/db';

export class TfaCodeDto extends createZodDto(enable2faSchema) {}
