import { DashboardService } from './../dashboard/dashboard.service';
import { FakeTypeOrmOperations } from './../shared/test-utils/typeorm-test.utils';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrafficLightService } from './traffic-light.service';
import { TrafficLight } from './traffic-light.entity';

describe('TrafficLightService', () => {
  let service: TrafficLightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficLightService,
        { provide: getRepositoryToken(TrafficLight), useValue: FakeTypeOrmOperations },
        { provide: DashboardService, useValue: { getDashboardById: jest.fn() } }
      ],
    }).compile();

    service = module.get<TrafficLightService>(TrafficLightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
