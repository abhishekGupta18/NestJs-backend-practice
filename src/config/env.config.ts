import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvConfig {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsBoolean()
  PROMETHEUS_DEFAULT_METRICS_ENABLED: boolean;

  @IsNotEmpty()
  @IsString()
  PROMETHEUS_METRICS_PATH: string;

  @IsNotEmpty()
  @IsNumber()
  PROMETHEUS_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  GRAFANA_PORT: number;

  @IsNotEmpty()
  @IsString()
  GRAFANA_ADMIN_PASSWORD: string;

  @IsNotEmpty()
  @IsNumber()
  LOKI_PORT: number;

  @IsNotEmpty()
  @IsString()
  LOKI_API_TOKEN: string;
}
