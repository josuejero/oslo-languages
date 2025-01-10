// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private isProd = process.env.NODE_ENV === 'production';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const logEntry = this.formatMessage(level, message, context);

    if (this.isProd) {
      // In production, you would typically send this to a logging service
      // Example: await fetch('your-logging-service', { method: 'POST', body: JSON.stringify(logEntry) });
      console[level](JSON.stringify(logEntry));
    } else {
      // In development, pretty print to console
      const color = {
        info: '\x1b[36m', // cyan
        warn: '\x1b[33m', // yellow
        error: '\x1b[31m', // red
      }[level];
      
      console[level](
        `${color}[${logEntry.timestamp}] ${level.toUpperCase()}\x1b[0m:`,
        message,
        context || ''
      );
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }
}

export const logger = Logger.getInstance();