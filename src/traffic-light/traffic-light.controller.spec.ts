import { DashboardService } from './../dashboard/dashboard.service';
import { FakeTypeOrmOperations } from './../shared/test-utils/typeorm-test.utils';
import { TrafficLight } from './traffic-light.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TrafficLightController } from './traffic-light.controller';
import { TrafficLightService } from './traffic-light.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TrafficLightController', () => {
  let controller: TrafficLightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficLightController],
      providers: [
        TrafficLightService,
        { provide: getRepositoryToken(TrafficLight), useValue: FakeTypeOrmOperations },
        { provide: DashboardService, useValue: { getDashboardById: jest.fn() } }
      ],
    }).compile();

    controller = module.get<TrafficLightController>(TrafficLightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
