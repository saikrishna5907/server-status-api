import { RANDOM_NUMBER_FOR_COMPARISON } from './../constants/index';
import { GET_DASHBOARD_BY_ID_NOT_FOUND, GET_TRAFFIC_LIGHT_BY_ID_NOT_FOUND } from './../constants/error-messages/index';
import { DashboardService } from './../dashboard/dashboard.service';
import { TrafficLight } from './traffic-light.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTrafficLightDTO } from './dtos/add-traffic-light.dto';
import axios from "axios"
import { GetStatusResponseDTO } from './dtos/get-status-response.dto';
@Injectable()
export class TrafficLightService {

    public constructor(@InjectRepository(TrafficLight) private repo: Repository<TrafficLight>, private dashBoardService: DashboardService) { }


    public async addTrafficLight(body: AddTrafficLightDTO): Promise<TrafficLight> {
        const dashBoard = await this.dashBoardService.getDashboardById(body.dashboardId)
        if (!dashBoard) {
            throw new NotFoundException(GET_DASHBOARD_BY_ID_NOT_FOUND)
        }

        const trafficLight = new TrafficLight()
        trafficLight.status = body.status

        if (trafficLight.dashboards && trafficLight.dashboards.length > 0) {
            trafficLight.dashboards.push(dashBoard)
        }
        trafficLight.dashboards = [dashBoard]
        trafficLight.created_At = new Date()
        trafficLight.updated_At = new Date()

        return this.repo.save(trafficLight);
    }

    public async getResponseCode(id: number): Promise<GetStatusResponseDTO> {
        const trafficLight = await this.repo.findOneBy({ id });
        if (!trafficLight) {
            throw new NotFoundException(GET_TRAFFIC_LIGHT_BY_ID_NOT_FOUND);
        }
        // this is a random logic where it request random number between 100 and 1000
        // it gets a single number and the logic is if number is greater than 500 then we send status false else true 
        let statusCode: number;
        try {
            const response = await axios.get<number[]>('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1')

            if (response.data && response.data.length) {
                const number = response.data[0]
                statusCode = number > RANDOM_NUMBER_FOR_COMPARISON ? 500 : 200
            } else {
                // external api return empty
                statusCode = 500
            }

        } catch (error) {
            statusCode = 500
        }

        return { statusCode };
    }
}
