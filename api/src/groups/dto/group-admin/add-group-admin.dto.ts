import { addGroupAdminSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class AddGroupAdminDto extends createZodDto(addGroupAdminSchema) {}
