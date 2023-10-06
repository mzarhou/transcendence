import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get(':id')
  async findOneRank(@Param('id') id: string) {
    return this.rankService.getOneRank(+id);
  }

  @Get()
  async getAllRank() {
    this.rankService.updateRank();
    const users = await this.rankService.getAllRank();
    return users;
  }
  @Get('prov')
  async getProvRanking() {
    this.rankService.updateRank();
    const users = await this.rankService.getProvRank();
    return users;
  }

  @Get('esta')
  async getEstaRanking() {
    this.rankService.updateRank();
    const users = await this.rankService.getEstaRank();
    return users;
  }
}
