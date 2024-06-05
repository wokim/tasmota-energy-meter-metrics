import { Test, TestingModule } from '@nestjs/testing';
import { EnergyMeterService } from './energy-meter.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';

describe('EnergyMeterService', () => {
  let service: EnergyMeterService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergyMeterService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnergyMeterService>(EnergyMeterService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEnergyMeterData', () => {
    fit('should parse energy meter data correctly', async () => {
      const mockData = `{t}{s} Temperature{m}35.8 °C{e}<tr><td colspan=2 style='font-size:2px'><hr/></td></tr></table>{t}{s}</th><th></th><th style='text-align:center'><th></th><td>{e}{s}Voltage{m}</td><td style='text-align:left'>224</td><td>&nbsp;</td><td> V{e}{s}Current{m}</td><td style='text-align:left'>0.233</td><td>&nbsp;</td><td> A{e}{s}Active Power{m}</td><td style='text-align:left'>2</td><td>&nbsp;</td><td> W{e}{s}Apparent Power{m}</td><td style='text-align:left'>52</td><td>&nbsp;</td><td> VA{e}{s}Reactive Power{m}</td><td style='text-align:left'>52</td><td>&nbsp;</td><td> VAr{e}{s}Power Factor{m}</td><td style='text-align:left'>0.04</td><td>&nbsp;</td><td>                         {e}{s}Energy Today{m}</td><td style='text-align:left'>0.025</td><td>&nbsp;</td><td> kWh{e}{s}Energy Yesterday{m}</td><td style='text-align:left'>1.351</td><td>&nbsp;</td><td> kWh{e}{s}Energy Total{m}</td><td style='text-align:left'>113.214</td><td>&nbsp;</td><td> kWh{e}</table>{t}<tr><td colspan=2 style='font-size:2px'><hr/></td></tr></table>{t}<tr><td style='width:100%;text-align:center;font-weight:bold;font-size:62px'>ON</td></tr><tr></tr></table>`;

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ data: mockData } as any));

      const result = await service.fetchEnergyMeterData(
        'dehumidifierEnergyMeter',
      );

      expect(result).toEqual({
        // Temperature: { value: 36.8, uni,
        Voltage: { value: 224, unit: 'V' },
        Current: { value: 0.233, unit: 'A' },
        'Active Power': { value: 2, unit: 'W' },
        'Apparent Power': { value: 52, unit: 'VA' },
        'Reactive Power': { value: 52, unit: 'VAr' },
        'Power Factor': { value: 0.04, unit: '' },
        // 'Energy Today': { value: 0.022,
        // 'Energy Yesterday': { value: 1.351,
        // 'Energy Total': { value: 113.211,
      });
    });
  });
});
