import { Module } from '@nestjs/common';
import { EnergyMeterController } from './energy-meter.controller';
import { EnergyMeterService } from './energy-meter.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EnergyMeterController],
  providers: [EnergyMeterService],
})
export class EnergyMeterModule {}
