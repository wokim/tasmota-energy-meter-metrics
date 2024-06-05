import { Controller, Get } from '@nestjs/common';
import { EnergyMeterService } from './energy-meter.service';

@Controller()
export class EnergyMeterController {
  constructor(private readonly energyMeterService: EnergyMeterService) {}

  @Get()
  async getEnergyMeterData() {
    return this.energyMeterService.getEnergyMeterData();
  }

  @Get('metrics')
  async getEnergyMeterMetrics() {
    return this.energyMeterService.getEnergyMeterMetrics();
  }
}
