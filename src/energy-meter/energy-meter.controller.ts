import { Controller, Get, Header } from '@nestjs/common';
import { EnergyMeterService } from './energy-meter.service';

@Controller()
export class EnergyMeterController {
  constructor(private readonly energyMeterService: EnergyMeterService) {}

  @Get('/info')
  async getEnergyMeterData() {
    return this.energyMeterService.getEnergyMeterData();
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getEnergyMeterMetrics() {
    return this.energyMeterService.getEnergyMeterMetrics();
  }
}
