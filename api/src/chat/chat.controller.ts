import { Body, Controller, Post } from '@nestjs/common';
import { SearchUsersDto } from './dto/search-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('search')
  search(@ActiveUser() user: ActiveUserData, @Body() { term }: SearchUsersDto) {
    if (term.length === 0) {
      return [];
    }
    return this.prisma.user.findMany({
      where: {
        id: {
          notIn: [user.sub],
        },
        name: {
          contains: term,
        },
      },
    });
  }
}
