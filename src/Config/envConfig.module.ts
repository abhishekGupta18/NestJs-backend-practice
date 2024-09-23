import { EnvConfig } from '@config/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const envConfig = registerAs(
  'env',
  () =>
    ({
      PORT: parseInt(process.env.PORT, 10),
      NODE_ENV: process.env.NODE_ENV,
      PROMETHEUS_DEFAULT_METRICS_ENABLED: process.env.PROMETHEUS_DEFAULT_METRICS_ENABLED === 'true',
      PROMETHEUS_METRICS_PATH: process.env.PROMETHEUS_METRICS_PATH,
      PROMETHEUS_PORT: parseInt(process.env.PROMETHEUS_PORT, 10),
      GRAFANA_PORT: parseInt(process.env.GRAFANA_PORT, 10),
      GRAFANA_ADMIN_PASSWORD: process.env.GRAFANA_ADMIN_PASSWORD,
    }) as EnvConfig
);

const validationSchema = Joi.object({
  PORT: Joi.number().port().required(),
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PROMETHEUS_DEFAULT_METRICS_ENABLED: Joi.boolean().default(true),
  PROMETHEUS_METRICS_PATH: Joi.string().allow(null, ''),
  PROMETHEUS_PORT: Joi.number().port().allow(null),
  GRAFANA_PORT: Joi.number().port().allow(null),
  GRAFANA_ADMIN_PASSWORD: Joi.string().allow(null, ''),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfigModule {}
