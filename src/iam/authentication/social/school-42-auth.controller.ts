import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { School42TokenDto } from '../dto/school-42-token.dto';
import { School42AuthService } from './school42-auth.service';

@Controller('authentication/school-42')
export class School42AuthController {
  constructor(private readonly school42AuthService: School42AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  authenticate(@Body() tokenDto: School42TokenDto) {
    return this.school42AuthService.authenticate(tokenDto.accessToken);
  }
}
