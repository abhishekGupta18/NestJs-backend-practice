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
      LOKI_PORT: parseInt(process.env.LOKI_PORT, 10),
      LOKI_API_TOKEN: process.env.LOKI_API_TOKEN,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_TLS_ENABLED: process.env.REDIS_TLS_ENABLED.toString().toLowerCase() === 'true',
      POSTGRES_DB: process.env.POSTGRES_DB,
      POSTGRES_USER: process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
      POSTGRES_HOST: process.env.POSTGRES_HOST,
      POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10),
      DATABASE_URL: process.env.DATABASE_URL,
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
  LOKI_PORT: Joi.number().port().allow(null),
  LOKI_API_TOKEN: Joi.string().allow(null, ''),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_TLS_ENABLED: Joi.boolean().default(false),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required(),
  // Regex validation for PostgreSQL connection string
  DATABASE_URL: Joi.string()
    .required()
    .pattern(/^postgresql:\/\//)
    .messages({
      'string.pattern.base': 'DATABASE_URL must start with "postgresql://"',
      'string.empty': 'DATABASE_URL is required',
    }),
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
