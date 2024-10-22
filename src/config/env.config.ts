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

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string;

  @IsNotEmpty()
  @IsBoolean()
  REDIS_TLS_ENABLED: boolean;

  @IsNotEmpty()
  @IsString()
  POSTGRES_DB: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE: number;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE_SIZE: number;
}
