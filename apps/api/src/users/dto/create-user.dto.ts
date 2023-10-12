import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z
  .object({
    name: z.string().min(4),
    email: z.string().email(),
    avatar: z.string().url(),
    school42Id: z.number().positive().optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    (data) => data.school42Id !== undefined || data.password !== undefined,
    'You must specify password or school42Id',
  );

export class CreateUserDto extends createZodDto(createUserSchema) {}
