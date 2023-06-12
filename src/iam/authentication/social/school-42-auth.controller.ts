import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { UserAgent } from '../decorators/user-agent.decorator';
import { School42AuthDto } from '../dto/school-42-token.dto';
import { AuthType } from '../enum/auth-type.enum';
import { School42AuthService } from './school42-auth.service';

@Auth(AuthType.None)
@Controller('authentication/school-42')
export class School42AuthController {
  constructor(private readonly school42AuthService: School42AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  authenticate(
    @UserAgent() userAgent: string,
    @Body() school42AuthDto: School42AuthDto,
  ) {
    return this.school42AuthService.authenticate(school42AuthDto, userAgent);
  }
}
