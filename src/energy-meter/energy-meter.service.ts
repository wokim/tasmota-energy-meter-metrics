import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Gauge, Registry } from 'prom-client';
import { firstValueFrom } from 'rxjs';

export interface EnergyMeterData {
  [property: string]: {
    value: number;
    unit: string;
  };
}

@Injectable()
export class EnergyMeterService {
  private readonly energyMeterEndpoints: {
    [energyMeterName: string]: string;
  };
  private readonly registry: Registry;
  private readonly gauges: { [property: string]: Gauge };
  private readonly logger = new Logger(EnergyMeterService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.energyMeterEndpoints = {
      dehumidifierEnergyMeter: this.configService.get<string>(
        'dehumidifierEnergyMeterEndpoint',
      ),
      heatingCoolingWaterHeatingEnergyMeter: this.configService.get<string>(
        'heatingCoolingWaterHeatingEnergyMeterEndpoint',
      ),
    };

    this.registry = new Registry();
    this.gauges = this.createGauges();

    for (const property in this.gauges) {
      this.registry.registerMetric(this.gauges[property]);
    }
  }

  private createGauges(): { [property: string]: Gauge } {
    return {
      voltage: new Gauge({
        name: `tasmota_energy_meter_voltage_volts`,
        help: 'Energy meter voltage in Volts',
        labelNames: ['meter_id'],
      }),
      current: new Gauge({
        name: `tasmota_energy_meter_current_amperes`,
        help: 'Energy meter current in Amperes',
        labelNames: ['meter_id'],
      }),
      activePower: new Gauge({
        name: `tasmota_energy_meter_active_power_watts`,
        help: 'Energy meter active power in Watts',
        labelNames: ['meter_id'],
      }),
      apparentPower: new Gauge({
        name: `tasmota_energy_meter_apparent_power_va`,
        help: 'Energy meter apparent power in VA',
        labelNames: ['meter_id'],
      }),
      reactivePower: new Gauge({
        name: `tasmota_energy_meter_reactive_power_var`,
        help: 'Energy meter reactive power in VAr',
        labelNames: ['meter_id'],
      }),
      powerFactor: new Gauge({
        name: `tasmota_energy_meter_power_factor`,
        help: 'Energy meter power factor',
        labelNames: ['meter_id'],
      }),
    };
  }

  private toCamelCase(str: string): string {
    // 문자열을 단어로 분리하고 특수 문자 제거
    const words = str.split(/[\s_-]+/);

    // 첫 번째 단어는 소문자로 변환
    const camelCased =
      words[0].toLowerCase() +
      // 나머지 단어들은 첫 글자만 대문자로 변환
      words
        .slice(1)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join('');

    // 알파벳과 숫자만 유지
    return camelCased.replace(/[^a-zA-Z0-9]/g, '');
  }

  private removeHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  async fetchEnergyMeterData(meterId: string): Promise<EnergyMeterData> {
    const endpoint = this.energyMeterEndpoints[meterId];
    const response = await firstValueFrom(this.httpService.get(endpoint));
    const data = this.removeHtmlTags(response.data);

    const regex =
      /{s}(Temperature|Voltage|Current|Active Power|Apparent Power|Reactive Power|Power Factor){m}([\d.]+)(?:&nbsp;|\s)(.*?)(?:{e}|&nbsp;)/g;
    const matches = data.matchAll(regex);
    const result: EnergyMeterData = {};

    for (const match of matches) {
      const key = match[1];
      const value = parseFloat(match[2]);
      const unit = match[3].trim();
      result[this.toCamelCase(key)] = { value, unit }; // `${value} ${unit}`.trim();
    }

    return result;
  }

  async getEnergyMeterData(): Promise<{ [meterId: string]: EnergyMeterData }> {
    const meterIds = Object.keys(this.energyMeterEndpoints);
    const energyMeterData: {
      [meterId: string]: EnergyMeterData;
    } = {};

    this.logger.debug(`Fetching energy meter data for ${meterIds.join(', ')}`);
    for (const meterId of meterIds) {
      const data = await this.fetchEnergyMeterData(meterId);
      energyMeterData[meterId] = data;
    }

    return energyMeterData;
  }

  async getEnergyMeterMetrics(): Promise<string> {
    const meterIds = Object.keys(this.energyMeterEndpoints);

    this.registry.resetMetrics();

    for (const meterId of meterIds) {
      const data = await this.fetchEnergyMeterData(meterId);
      const gauges = this.gauges;

      gauges.voltage.set({ meter_id: meterId }, data['voltage'].value);
      gauges.current.set({ meter_id: meterId }, data['current'].value);
      gauges.activePower.set({ meter_id: meterId }, data['activePower'].value);
      gauges.apparentPower.set(
        { meter_id: meterId },
        data['apparentPower'].value,
      );
      gauges.reactivePower.set(
        { meter_id: meterId },
        data['reactivePower'].value,
      );
      gauges.powerFactor.set({ meter_id: meterId }, data['powerFactor'].value);
    }
    return this.registry.metrics();
  }
}
