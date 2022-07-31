import { FakeTypeOrmOperations } from './../shared/test-utils/typeorm-test.utils';
import { ValidationException } from './../shared/exceptions/validation-exception';
import { ADD_DUPLICATE_DASHBOARD_NAME, GET_DASHBOARDS_TAKE_ERROR, GET_DASHBOARD_INVALID_ID } from './../constants/error-messages/index';
import { ForbiddenException } from '@nestjs/common';
import { GetDashboardsDTO } from './dtos/get-dashboards.dto';
import { MAX_DASHBOARDS_TO_RETRIEVE } from './../constants/index';
import { Test, TestingModule } from '@nestjs/testing';
import { Dashboard } from './dashboard.entity';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


const mockInput: GetDashboardsDTO = { take: 100, populateTrafficLights: 'false' };

const mockDashBoardsWithRelationON = [{
  id: 1,
  name: "test",
  created_At: new Date(),
  updated_At: new Date(),
  trafficLights: [
    {
      id: 1,
      status: 1,
      created_At: new Date(),
      updated_At: new Date()
    },
    {
      id: 2,
      status: 1,
      created_At: new Date(),
      updated_At: new Date()
    }
  ]
},
{
  id: 2,
  name: "main",
  created_At: new Date(),
  updated_At: new Date(),
  trafficLights: [],
}] as Dashboard[]

const mockDashBoardsWithRelationOFF = mockDashBoardsWithRelationON.map((dashBoard: Dashboard) => {
  const newDashboard = { ...dashBoard }
  delete newDashboard.trafficLights
  return newDashboard
})
const exampleDashboardName = 'example name'
describe('DashboardService', () => {
  let service: DashboardService;
  let dashboardRepository: Repository<Dashboard>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, {
        provide: getRepositoryToken(Dashboard),
        useValue: FakeTypeOrmOperations
      }],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    dashboardRepository = module.get(getRepositoryToken(Dashboard));
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getDashboards', () => {
    test.each`
    a 
    ${undefined}
    ${null}
    ${0}
    ${MAX_DASHBOARDS_TO_RETRIEVE + 1}
    `('should throw error when take param is out of the range, given take value: $a ', async (a) => {
      const input: GetDashboardsDTO = { take: a };
      const dashboardRepositoryFindSpy = jest.spyOn(dashboardRepository, 'find')

      try {
        await service.getDashboards(input)
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(GET_DASHBOARDS_TAKE_ERROR);
        expect(dashboardRepositoryFindSpy).toHaveBeenCalledTimes(0)
      }
    })

    it('show throw an error if input params is invalid {} ', async () => {
      const input: GetDashboardsDTO = {} as GetDashboardsDTO;
      const dashboardRepositoryFindSpy = jest.spyOn(dashboardRepository, 'find')

      try {
        await service.getDashboards(input)
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(GET_DASHBOARDS_TAKE_ERROR);
        expect(dashboardRepositoryFindSpy).toHaveBeenCalledTimes(0)
      }
    })
    test.each`
    input
    ${{ ...mockInput, populateTrafficLights: '' } as GetDashboardsDTO}
    ${{ ...mockInput, populateTrafficLights: 'null' } as GetDashboardsDTO} 
    ${{ ...mockInput, populateTrafficLights: 'undefined' } as GetDashboardsDTO} 
    ${{ ...mockInput, populateTrafficLights: null } as GetDashboardsDTO} 
    ${{ ...mockInput, populateTrafficLights: undefined } as GetDashboardsDTO} 
    ${{ ...mockInput, populateTrafficLights: 'false' } as GetDashboardsDTO} 
    ${{ ...mockInput, populateTrafficLights: 'FALSE' } as GetDashboardsDTO} 
    `('should return valid Dashboards list with no traffic lights when take is $input.take and populateTrafficLights: $input.populateTrafficLights ', async (input) => {
      const dashboardRepositoryFindSpy = jest.spyOn(dashboardRepository, 'find').mockResolvedValue(mockDashBoardsWithRelationOFF)

      try {
        const result = await service.getDashboards(input);
        expect(result).toStrictEqual(mockDashBoardsWithRelationOFF)
        expect(dashboardRepositoryFindSpy).toHaveBeenCalled()
        expect(dashboardRepositoryFindSpy).toHaveBeenCalledTimes(1)
      } catch (error) {

      }

    })

    test.each`
    input
    ${{ ...mockInput, populateTrafficLights: 'true' } as GetDashboardsDTO}
    ${{ ...mockInput, populateTrafficLights: 'TRUE' } as GetDashboardsDTO}
    ${{ ...mockInput, populateTrafficLights: 'TRUE     ' } as GetDashboardsDTO}
    `('should return valid Dashboards list with traffic lights when take is $input.take and populateTrafficLights: $input.populateTrafficLights ', async (input) => {
      const dashboardRepositoryFindSpy = jest.spyOn(dashboardRepository, 'find').mockResolvedValue(mockDashBoardsWithRelationON)

      try {
        const result = await service.getDashboards(input);
        expect(result).toStrictEqual(mockDashBoardsWithRelationON)
        expect(dashboardRepositoryFindSpy).toHaveBeenCalled()
        expect(dashboardRepositoryFindSpy).toHaveBeenCalledTimes(1)
      } catch (error) {

      }

    })
  })

  describe('addDashboard', () => {

    it('should throw error when trying to add dashboard with duplicate name', async () => {
      const findOneBySpy = jest.spyOn(dashboardRepository, 'findOneBy').mockResolvedValue(mockDashBoardsWithRelationOFF[1])
      const saveSpy = jest.spyOn(dashboardRepository, 'save')
      try {
        await service.addDashBoard(exampleDashboardName)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException)
        expect(error.message).toBe(ADD_DUPLICATE_DASHBOARD_NAME)
        expect(saveSpy).toHaveBeenCalledTimes(0)
        expect(findOneBySpy).toHaveBeenCalledTimes(1)
      }
    })

    it('should save new Dashboard given unique name', async () => {
      const findOneBySpy = jest.spyOn(dashboardRepository, 'findOneBy').mockResolvedValue(null)
      const saveSpy = jest.spyOn(dashboardRepository, 'save')
      const expectedResult: Dashboard = {
        created_At: new Date(),
        updated_At: new Date(),
        id: 1,
        name: exampleDashboardName,
        trafficLights: []
      }

      try {
        const result = await service.addDashBoard(exampleDashboardName)
        expect(result).toStrictEqual(expectedResult)
        expect(saveSpy).toHaveBeenCalledTimes(0)
        expect(findOneBySpy).toHaveBeenCalledTimes(1)
      } catch (error) {

      }
    })
  })


  describe('getDashboardById', () => {
    test.each`
    a
    ${0}
    ${null}
    ${undefined}
    ${-123123}
    `('should throw error when trying if given id is invalid: $a', async (a) => {
      const findOneBySpy = jest.spyOn(dashboardRepository, 'findOneBy')
      try {
        await service.getDashboardById(a)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException)
        expect(error.message).toBe(GET_DASHBOARD_INVALID_ID)
        expect(findOneBySpy).toHaveBeenCalledTimes(0)
      }
    })

    it('should get a Dashboard given valid Id', async () => {
      const findOneBySpy = jest.spyOn(dashboardRepository, 'findOneBy').mockResolvedValue(mockDashBoardsWithRelationOFF[0])
      try {
        const result = await service.addDashBoard(exampleDashboardName)
        expect(result).toStrictEqual(mockDashBoardsWithRelationOFF[0])
        expect(findOneBySpy).toHaveBeenCalledTimes(1)
      } catch (error) {

      }
    })
  })

});
