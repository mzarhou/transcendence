import { removeGroupAdminSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class RemoveGroupAdminDto extends createZodDto(removeGroupAdminSchema) {}
