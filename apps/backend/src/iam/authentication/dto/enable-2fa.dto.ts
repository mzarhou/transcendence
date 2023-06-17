import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const enable2faDtoSchema = z.object({
  tfaCode: z.string().regex(/\d{6}/),
});

export class Enable2faDto extends createZodDto(enable2faDtoSchema) {}
