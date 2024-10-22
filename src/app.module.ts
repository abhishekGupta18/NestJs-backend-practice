import { BackgroundModule } from '@bg/background.module';
import { QueuePrefix } from '@bg/constants/job.constant';
import { EnvConfigModule } from '@config/env-config.module';
import { EnvConfig } from '@config/env.config';
import { DBModule } from '@db/db.module';
import { HealthModule } from '@health/health.module';
import { HttpLoggingInterceptor } from '@interceptors/logging.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { LoggerModule } from '@logger/logger.module';
import { MetricsModule } from '@metrics/metrics.module';
import { MetricsMiddleware } from '@middlewares/metrics.middleware';
import { ApolloDriver } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

// Queue module
const queueModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<EnvConfig>) => {
    const redisHost = configService.getOrThrow<string>('REDIS_HOST', { infer: true });
    const redisPort = configService.getOrThrow<number>('REDIS_PORT', { infer: true });
    const redisPassword = configService.getOrThrow<string>('REDIS_PASSWORD', { infer: true });
    const redisTlsEnabled = configService.get<boolean>('REDIS_TLS_ENABLED', { infer: true });

    console.log(`Connecting to Redis at ${redisHost}:${redisPort} with TLS: ${redisTlsEnabled}`);

    return {
      prefix: QueuePrefix.AUTH,
      connection: {
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        tls: redisTlsEnabled ? {} : undefined, // If TLS is enabled, configure it here
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    };
  },
  inject: [ConfigService],
});

// Rate Limiting
const rateLimit = ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 5 * 60, // Time to live in seconds (5 minutes)
    limit: 15, // Maximum number of requests within the ttl
  },
  {
    name: 'medium',
    ttl: 15 * 60, // 15 minutes
    limit: 50,
  },
  {
    name: 'long',
    ttl: 60 * 60, // 1 hour
    limit: 150,
  },
]);

// GraphQL module
const graphqlModule = GraphQLModule.forRoot({
  autoSchemaFile: 'schema.gql',
  driver: ApolloDriver,
  installSubscriptionHandlers: true,
  subscriptions: {
    'graphql-ws': true,
    'subscriptions-transport-ws': {
      path: '/graphql',
    },
  },
  context: ({ req }) => ({
    req,
  }),
});

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    rateLimit,
    graphqlModule,
    EnvConfigModule,
    LoggerModule,
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    queueModule,
    DBModule,
    // Background Workers
    BackgroundModule,
    // APIs
    MetricsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware only to '/graphql' routes
    consumer.apply(graphqlUploadExpress()).forRoutes('/graphql');

    // Apply to all routes
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
