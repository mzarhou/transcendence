import { sendMessageSchema } from '@transcendence/db';
import { createZodDto } from 'nestjs-zod';

export class MessageDto extends createZodDto(sendMessageSchema) {}
