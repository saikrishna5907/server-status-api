import { DashboardModule } from './../dashboard/dashboard.module';
import { TrafficLight } from './traffic-light.entity';
import { Module } from '@nestjs/common';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLightController } from './traffic-light.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficLight]), DashboardModule],
  controllers: [TrafficLightController],
  providers: [TrafficLightService]
})
export class TrafficLightModule { }
