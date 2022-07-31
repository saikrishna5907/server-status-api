import { FakeTypeOrmOperations } from './../shared/test-utils/typeorm-test.utils';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { Dashboard } from './dashboard.entity';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService, {
        provide: getRepositoryToken(Dashboard),
        useValue: FakeTypeOrmOperations
      }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
