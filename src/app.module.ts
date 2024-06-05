import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnergyMeterModule } from './energy-meter/energy-meter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          nodeEnv: process.env.NODE_ENV || 'development',
          port: parseInt(process.env.PORT, 10) || 3000,
          dehumidifierEnergyMeterEndpoint:
            process.env.DEHUMIDIFIER_ENERGY_METER_ENDPOINT ||
            'http://192.168.1.118?m=1',
          heatingCoolingWaterHeatingEnergyMeterEndpoint:
            process.env.HEATING_COOLING_WATER_HEATING_ENERGY_METER_ENDPOINT ||
            'http://192.168.1.215?m=1',
        }),
      ],
    }),
    EnergyMeterModule,
  ],
})
export class AppModule {}
