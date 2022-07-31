import { Dashboard } from './dashboard/dashboard.entity';
import { TrafficLight } from './traffic-light/traffic-light.entity';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficLightModule } from './traffic-light/traffic-light.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [TrafficLight, Dashboard],
          synchronize: true
        }
      }
    }),
    TrafficLightModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule { }
