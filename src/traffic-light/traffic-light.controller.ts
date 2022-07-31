import { TrafficLight } from './traffic-light.entity';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { AddTrafficLightDTO } from './dtos/add-traffic-light.dto';
// traffic-light
@Controller()
export class TrafficLightController {
  constructor(private readonly trafficLightService: TrafficLightService) { }

  @Get('/status/:id')
  public async getStatus(@Param('id') id: string): Promise<TrafficLight> {
    return this.trafficLightService.getTrafficLightById(parseInt(id))
  }

  @Post('/traffic-light')
  public async addTrafficLight(@Body() body: AddTrafficLightDTO): Promise<TrafficLight> {
    return this.trafficLightService.addTrafficLight(body)
  }
}
