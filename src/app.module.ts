import { HttpLoggingInterceptor } from '@common/interceptor/logging.interceptor';
import { TransformInterceptor } from '@common/interceptor/transform.interceptor';
import { MetricsMiddleware } from '@common/middlewares/metrics.middleware';
import { EnvConfigModule } from '@config/env-config.module';
import { LoggerModule } from '@logger/logger.module';
import { MetricsModule } from '@metrics/metrics.module';
import { ApolloDriver } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

@Module({
  imports: [
    // Debugging tools
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    // Rate limiting
    ThrottlerModule.forRoot([
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
    ]),
    // GraphQL module
    GraphQLModule.forRoot({
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
    }),
    // Custom modules
    EnvConfigModule,
    MetricsModule,
    LoggerModule,
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
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
