import { Controller, Delete, Get, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/')
  findAll(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.findNotifications(user);
  }

  @Delete('/clear-all')
  async clearAll(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.clearAll(user);
  }

  @Patch('/read-all')
  async readAll(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.readAll(user);
  }
}
