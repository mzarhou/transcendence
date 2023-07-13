import { Body, Controller, Post } from '@nestjs/common';
import { SearchUsersDto } from './dto/search-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('search')
  search(@Body() { term }: SearchUsersDto) {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: term,
        },
      },
    });
  }
}
