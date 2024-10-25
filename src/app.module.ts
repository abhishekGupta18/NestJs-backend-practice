import { BackgroundModule } from '@bg/background.module';
import { QueuePrefix } from '@bg/constants/job.constant';
import { RouteNames } from '@common/route-names';
import { EnvConfigModule } from '@config/env-config.module';
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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@redis/redis.module';
import { REDIS_CLIENT } from '@redis/redis.provider';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { Redis } from 'ioredis';

// Queue module
const queueModule = BullModule.forRootAsync({
  imports: [RedisModule],
  useFactory: (redisClient: Redis) => {
    console.log(`Connecting to Redis using predefined client`);
    return {
      prefix: QueuePrefix.AUTH,
      connection: redisClient.options,
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
  inject: [REDIS_CLIENT],
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
    RedisModule,
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
    consumer.apply(graphqlUploadExpress()).forRoutes(RouteNames.GRAPHQL);

    // Apply to all routes
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
