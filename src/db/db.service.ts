import { EnvConfig } from '@config/env.config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

@Injectable()
export class DBService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pgClient: Client;
  constructor(config: ConfigService<EnvConfig>) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    console.log('Connecting to PostgreSQL with URL:', databaseUrl);

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    this.pgClient = new Client({
      connectionString: databaseUrl,
    });
  }

  async onModuleInit() {
    console.log('Here');
    await this.$connect();
    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
      console.log('Received notification: ', msg);
      if (msg.channel === 'password_updates') {
        console.log('Received password update notification', msg);
        // Handle NOTIFY events
        // const payload = JSON.parse(msg.payload)
        // TODO: Process the notification (e.g., publish to a pub/sub system)
      }
    });

    await this.pgClient.query('LISTEN password_updates');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pgClient.end();
  }
}
