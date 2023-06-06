import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const school42TokenSchema = z.object({
  accessToken: z.string().min(1),
});

export class School42TokenDto extends createZodDto(school42TokenSchema) {}
