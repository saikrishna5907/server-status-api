import { TrafficLight } from './traffic-light.entity';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { AddTrafficLightDTO } from './dtos/add-traffic-light.dto';
import { GetStatusResponseDTO } from './dtos/get-status-response.dto';
// traffic-light
@Controller()
export class TrafficLightController {
  constructor(private readonly trafficLightService: TrafficLightService) { }

  @Get('/status/:id')
  public async getStatus(@Param('id') id: string): Promise<GetStatusResponseDTO> {
    return this.trafficLightService.getResponseCode(parseInt(id))
  }

  @Post('/traffic-light')
  public async addTrafficLight(@Body() body: AddTrafficLightDTO): Promise<TrafficLight> {
    return this.trafficLightService.addTrafficLight(body)
  }

  @Get('/trafficLightsByDashboard/:id')
  public async trafficLightsByDashboard(@Param('id') id: string) {
    return await this.trafficLightService.trafficLightsByDashboard(parseInt(id))
  }
}
