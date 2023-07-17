import { sendMessageSchema } from '@transcendence/common';
import { createZodDto } from 'nestjs-zod';

export class MessageDto extends createZodDto(sendMessageSchema) {}
