# Tasmota Energy Meter Metrics

This project is an API server that provides data from energy meters. It offers measured values from dehumidifier and heating/cooling/water heating energy meters in both JSON and Prometheus metric formats.

## API Endpoints

### GET /

This endpoint returns the measured values from the dehumidifier and heating/cooling/water heating energy meters in JSON format.

```json
{
  "dehumidifierEnergyMeter": {
    "Voltage": {
      "value": 224,
      "unit": "V"
    },
    "Current": {
      "value": 0.233,
      "unit": "A"
    },
    ...
  },
  "heatingCoolingWaterHeatingEnergyMeter": {
    "Voltage": {
      "value": 230,
      "unit": "V"
    },
    "Current": {
      "value": 1.5,
      "unit": "A"
    },
    ...
  }
}
```

### GET /metrics

This endpoint returns the measured values from the energy meters in Prometheus metric format.

```
# HELP energy_meter_voltage_volts_dehumidifierEnergyMeter Energy meter voltage in Volts
# TYPE energy_meter_voltage_volts_dehumidifierEnergyMeter gauge
tasmota_energy_meter_voltage_volts_dehumidifierEnergyMeter{meter_id="dehumidifierEnergyMeter"} 224

# HELP energy_meter_current_amperes_dehumidifierEnergyMeter Energy meter current in Amperes
# TYPE energy_meter_current_amperes_dehumidifierEnergyMeter gauge
tasmota_energy_meter_current_amperes_dehumidifierEnergyMeter{meter_id="dehumidifierEnergyMeter"} 0.233

...

# HELP energy_meter_voltage_volts_heatingCoolingWaterHeatingEnergyMeter Energy meter voltage in Volts
# TYPE energy_meter_voltage_volts_heatingCoolingWaterHeatingEnergyMeter gauge
tasmota_energy_meter_voltage_volts_heatingCoolingWaterHeatingEnergyMeter{meter_id="heatingCoolingWaterHeatingEnergyMeter"} 230

# HELP energy_meter_current_amperes_heatingCoolingWaterHeatingEnergyMeter Energy meter current in Amperes
# TYPE energy_meter_current_amperes_heatingCoolingWaterHeatingEnergyMeter gauge
tasmota_energy_meter_current_amperes_heatingCoolingWaterHeatingEnergyMeter{meter_id="heatingCoolingWaterHeatingEnergyMeter"} 1.5

...
```

## Configuration

Before running the API server, you need to set the following environment variables in the .env file:

```
PORT=3000
DEHUMIDIFIER_ENERGY_METER_ENDPOINT=http://dehumidifier-energy-meter/data
HEATING_COOLING_WATER_HEATING_ENERGY_METER_ENDPOINT=http://heating-cooling-water-heating-energy-meter/data
```

- `PORT`: Specifies the port number on which the API server will run.
- `DEHUMIDIFIER_ENERGY_METER_ENDPOINT`: Specifies the endpoint URL to fetch data from the dehumidifier energy meter.
- `HEATING_COOLING_WATER_HEATING_ENERGY_METER_ENDPOINT`: Specifies the endpoint URL to fetch data from the heating/cooling/water heating energy meter.

## Running the Server

1. Install the dependencies by running the following command in the project's root directory:

   ```sh
   npm install
   ```

2. To start the API server, run the following command:

   ```sh
   npm start
   ```

   Once the server is started, you can access the API at the specified port.

## License

MIT
