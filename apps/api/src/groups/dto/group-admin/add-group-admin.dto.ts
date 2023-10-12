import { addGroupAdminSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class AddGroupAdminDto extends createZodDto(addGroupAdminSchema) {}
