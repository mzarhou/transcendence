import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const school42AuthSchema = z.object({
  accessToken: z.string().min(1),
});

export class School42AuthDto extends createZodDto(school42AuthSchema) {}
