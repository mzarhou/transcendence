import { createZodDto } from 'nestjs-zod';
import { enable2faSchema } from '@transcendence/common';

export class TfaCodeDto extends createZodDto(enable2faSchema) {}
