import { createZodDto } from 'nestjs-zod';
import { enable2faDtoSchema } from './enable-2fa.dto';

export class TfaCodeDto extends createZodDto(enable2faDtoSchema) {}
