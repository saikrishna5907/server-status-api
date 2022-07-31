import { DashboardService } from './../dashboard/dashboard.service';
import { TrafficLight } from './traffic-light.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTrafficLightDTO } from './dtos/add-traffic-light.dto';
import axios, { AxiosResponse } from "axios"
@Injectable()
export class TrafficLightService {

    public constructor(@InjectRepository(TrafficLight) private repo: Repository<TrafficLight>, private dashBoardService: DashboardService) { }


    public async addTrafficLight(body: AddTrafficLightDTO): Promise<TrafficLight> {
        const dashBoard = await this.dashBoardService.getDashboardById(body.dashboardId)
        if (!dashBoard) {
            throw new NotFoundException('Dashboard is not found')
        }

        const trafficLight = new TrafficLight()
        trafficLight.status = body.status ? 1 : 0

        if (trafficLight.dashboards && trafficLight.dashboards.length > 0) {
            trafficLight.dashboards.push(dashBoard)
        }
        trafficLight.dashboards = [dashBoard]
        trafficLight.created_At = new Date()
        trafficLight.updated_At = new Date()

        return this.repo.save(trafficLight);
    }

    public async getTrafficLightById(id: number): Promise<TrafficLight> {
        const trafficLight = await this.repo.findOneBy({ id });
        if (!trafficLight) {
            throw new NotFoundException('trafficLight not found');
        }
        // this is a random logic where it request random number between 
        const request = await axios.get<AxiosResponse<number[]>>('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1')
        console.log(request.data);

        return trafficLight;
    }
}
