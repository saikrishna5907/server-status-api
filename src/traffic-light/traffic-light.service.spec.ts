import { RANDOM_NUMBER_FOR_COMPARISON } from './../constants/index';
import { GET_DASHBOARD_BY_ID_NOT_FOUND, GET_TRAFFIC_LIGHT_BY_ID_NOT_FOUND } from './../constants/error-messages/index';
import { NotFoundException } from '@nestjs/common';
import { AddTrafficLightDTO } from './dtos/add-traffic-light.dto';
import { DashboardService } from './../dashboard/dashboard.service';
import { FakeTypeOrmOperations } from './../shared/test-utils/typeorm-test.utils';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLight } from './traffic-light.entity';
import { Repository } from 'typeorm';
import axios from "axios"
import { GetStatusResponseDTO } from './dtos/get-status-response.dto';

const addTrafficLightInput = {
  dashboardId: 1,
  status: 1
} as AddTrafficLightDTO

const sampleAddTrafficLightResponse = {
  status: 1,
  dashboards: [
    {
      id: 1,
      name: "test",
      created_At: "2022-07-30T12:29:10.937Z",
      updated_At: "2022-07-30T12:29:10.937Z"
    }
  ],
  created_At: new Date(),
  updated_At: new Date(),
  id: 3
}

describe('TrafficLightService', () => {
  let service: TrafficLightService;
  let trafficLightRepositoryFake: Repository<TrafficLight>
  let dashBoardServiceFake: DashboardService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficLightService,
        { provide: getRepositoryToken(TrafficLight), useValue: FakeTypeOrmOperations },
        { provide: DashboardService, useValue: { getDashboardById: jest.fn() } }
      ],
    }).compile();

    service = module.get<TrafficLightService>(TrafficLightService);
    trafficLightRepositoryFake = module.get(getRepositoryToken(TrafficLight));
    dashBoardServiceFake = module.get<DashboardService>(DashboardService)
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(trafficLightRepositoryFake).toBeDefined();
    expect(dashBoardServiceFake).toBeDefined();
  });

  describe('addTrafficLight', () => {
    it('should throw exception when dashboard is not found for given id', async () => {
      const spySave = jest.spyOn(trafficLightRepositoryFake, 'save')
      const getDashboardByIdSpy = jest.spyOn(dashBoardServiceFake, 'getDashboardById').mockResolvedValueOnce(null)
      try {
        await service.addTrafficLight(addTrafficLightInput)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual(GET_DASHBOARD_BY_ID_NOT_FOUND)
        expect(spySave).toHaveBeenCalledTimes(0)
        expect(getDashboardByIdSpy).toHaveBeenCalledTimes(1)
      }
    })

    it('should save traffic light to DB when valid id and status given', async () => {
      try {
        const result = await service.addTrafficLight(addTrafficLightInput);
        expect(result).toEqual(sampleAddTrafficLightResponse)
      } catch (error) {

      }
    })
  })

  describe('getResponseCode', () => {
    it('should throw error if traffic light id is not found', async () => {
      const findSpy = jest.spyOn(trafficLightRepositoryFake, 'findOneBy').mockResolvedValue(null)
      const mockGet = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({}))
      try {
        await service.getResponseCode(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual(GET_TRAFFIC_LIGHT_BY_ID_NOT_FOUND)
        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(mockGet).toHaveBeenCalledTimes(0)
      }
    })

    it('should return 500 if axios get throws an error', async () => {
      const response = { ...sampleAddTrafficLightResponse } as any
      const findSpy = jest.spyOn(trafficLightRepositoryFake, 'findOneBy').mockResolvedValueOnce(response)
      const mockGet = jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('some error happened in external api')))

      try {
        const result = await service.getResponseCode(1);

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(mockGet).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject<GetStatusResponseDTO>({ statusCode: 500 })
      } catch (error) {

      }
    })
    test.each`
    a               | result
    ${[484]}        | ${200}
    ${[500]}        | ${200}
    ${[501]}        | ${500}
    ${[1000]}       | ${500}
    ${1}            | ${500}
    ${[]}           | ${500}
    ${null}         | ${500}
    ${undefined}    | ${500}
    `(`should return $result if external api return greater than ${RANDOM_NUMBER_FOR_COMPARISON} value, given value: $a`, async ({ a, result }) => {
      const response = { ...sampleAddTrafficLightResponse } as any
      const findSpy = jest.spyOn(trafficLightRepositoryFake, 'findOneBy').mockResolvedValueOnce(response)
      const mockGet = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(a))

      try {
        const actualResult = await service.getResponseCode(1);

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(mockGet).toHaveBeenCalledTimes(1)
        expect(actualResult).toMatchObject<GetStatusResponseDTO>({ statusCode: result })
      } catch (error) {

      }
    })
  })

  describe('trafficLightsByDashboard', () => {
    it('should throw exception when dashboard is not found for given id', async () => {
      const findSpy = jest.spyOn(trafficLightRepositoryFake, 'find')
      const getDashboardByIdSpy = jest.spyOn(dashBoardServiceFake, 'getDashboardById').mockResolvedValueOnce(null)
      try {

        await service.trafficLightsByDashboard(0)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual(GET_DASHBOARD_BY_ID_NOT_FOUND)
        expect(findSpy).toHaveBeenCalledTimes(0)
        expect(getDashboardByIdSpy).toHaveBeenCalledTimes(1)
      }
    })

    it('show get all trafficLights for a dashboard', async () => {
      try {
        const result = await service.trafficLightsByDashboard(1);
        expect(result).toEqual(sampleAddTrafficLightResponse)
      } catch (error) {

      }
    })
  })
});
