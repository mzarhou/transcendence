import { createZodDto } from 'nestjs-zod';
import { provide2faCodeDtoSchema } from '@transcendence/common';

export class Provide2faCodeDto extends createZodDto(provide2faCodeDtoSchema) {}
