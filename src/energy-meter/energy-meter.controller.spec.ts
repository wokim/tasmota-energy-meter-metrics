import { Test, TestingModule } from '@nestjs/testing';
import { EnergyMeterController } from './energy-meter.controller';
import { EnergyMeterService } from './energy-meter.service';

describe('EnergyMeterController', () => {
  let controller: EnergyMeterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EnergyMeterService,
          useValue: {
            getEnergyMeterData: jest.fn(),
            getEnergyMeterMetrics: jest.fn(),
          },
        },
      ],
      controllers: [EnergyMeterController],
    }).compile();

    controller = module.get<EnergyMeterController>(EnergyMeterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
