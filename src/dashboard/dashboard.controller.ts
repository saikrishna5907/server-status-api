import { GetDashboardsDTO } from './dtos/get-dashboards.dto';
import { AddDashboardDTO } from './dtos/add-dashboard.dto';
import { Dashboard } from './dashboard.entity';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('/dashboards')
  public async getDashBoards(@Query() body: GetDashboardsDTO): Promise<Dashboard[]> {
    return await this.dashboardService.getDashboards(body)
  }

  @Post('/dashboard')
  public async addDashBoard(@Body() body: AddDashboardDTO) {
    return await this.dashboardService.addDashBoard(body.name)
  }
}
