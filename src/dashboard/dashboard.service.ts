import { ADD_DUPLICATE_DASHBOARD_NAME, GET_DASHBOARD_INVALID_ID } from './../constants/error-messages/index';
import { MAX_DASHBOARDS_TO_RETRIEVE } from './../constants/index';
import { GetDashboardsDTO } from './dtos/get-dashboards.dto';
import { ValidationException } from './../shared/exceptions/validation-exception';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from './dashboard.entity';
import { GET_DASHBOARDS_TAKE_ERROR } from '../constants/error-messages'

@Injectable()
export class DashboardService {

    public constructor(@InjectRepository(Dashboard) private readonly repo: Repository<Dashboard>) { }

    public async getDashboards(body: GetDashboardsDTO): Promise<Dashboard[]> {
        const { take, populateTrafficLights } = body
        if (!take || take < 1 || take > MAX_DASHBOARDS_TO_RETRIEVE) {
            throw new ForbiddenException(GET_DASHBOARDS_TAKE_ERROR)
        }

        return this.repo.find({
            take,
            relations: {
                trafficLights: populateTrafficLights?.trim().toLowerCase() === 'true'
            }
        })
    }

    public async addDashBoard(name: string): Promise<Dashboard> {
        const dashboard = await this.repo.findOneBy({ name: name.toLowerCase() })
        if (dashboard) {
            throw new ValidationException(ADD_DUPLICATE_DASHBOARD_NAME)
        }
        const dashBoard = new Dashboard();
        dashBoard.name = name.toLowerCase();
        dashBoard.created_At = new Date()
        dashBoard.updated_At = new Date()
        dashBoard.trafficLights = []

        return await this.repo.save(dashBoard)
    }

    public async getDashboardById(id: number): Promise<Dashboard | null> {
        if (!id || id < 0) {
            throw new ValidationException(GET_DASHBOARD_INVALID_ID)
        }
        return await this.repo.findOneBy({ id })
    }
}
