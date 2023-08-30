import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';

@Module({
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
