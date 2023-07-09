import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const idSchema = z.object({
  id: z.string().regex(/\d+/).transform(Number),
});

export class IdDto extends createZodDto(idSchema) {}
