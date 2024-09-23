import { EnvConfig } from '@config/env.config';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private isLoggingEnabled: boolean;
  private logger: WinstonLogger;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    // Enable logging only in non-production environments
    const config = this.configService.get<string>('NODE_ENV');
    this.isLoggingEnabled = config !== 'production';

    // Create Winston logger with configuration
    this.logger = createLogger({
      level: this.isLoggingEnabled ? 'debug' : 'error', // Log only errors in production
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level}] [${context || 'App'}]: ${message}`;
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${level}] [${context || 'App'}]: ${message}`;
            })
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '1d', // keep file for only 1 day
        }),
      ],
    });
  }

  // Custom error log
  error(message: string, trace?: string, context?: string) {
    if (this.isLoggingEnabled) {
      this.logger.error({ message, trace, context });
    }
  }

  // Custom general log
  log(message: string, context?: string) {
    if (this.isLoggingEnabled) {
      this.logger.info({ message, context });
    }
  }

  // Custom warning log
  warn(message: string, context?: string) {
    if (this.isLoggingEnabled) {
      this.logger.warn({ message, context });
    }
  }

  // Additional debug log method (optional)
  debug(message: string, context?: string) {
    if (this.isLoggingEnabled) {
      this.logger.debug({ message, context });
    }
  }
}
