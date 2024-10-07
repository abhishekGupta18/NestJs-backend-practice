import { TransformInterceptor } from '@common/interceptor/transform.interceptor';
import { MetricsMiddleware } from '@common/middlewares/metrics.middleware';
import { EnvConfigModule } from '@config/env-config.module';
import { MetricsModule } from '@metrics/metrics.module';
import { ApolloDriver } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
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
    EnvConfigModule,
    MetricsModule,
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
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
