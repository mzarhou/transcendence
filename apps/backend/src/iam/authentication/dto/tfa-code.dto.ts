import { createZodDto } from 'nestjs-zod';
import { enable2faSchema } from '@transcendence/types';

export class TfaCodeDto extends createZodDto(enable2faSchema) {}
