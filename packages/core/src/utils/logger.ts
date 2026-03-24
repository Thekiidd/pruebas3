const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = typeof LOG_LEVELS[number];

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};
const RESET = '\x1b[0m';

export class Logger {
  private name: string;
  private minLevel: LogLevel;

  constructor(name: string, minLevel: LogLevel = 'info') {
    this.name = name;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.minLevel);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;
    const color = LEVEL_COLORS[level];
    const timestamp = new Date().toISOString();
    const prefix = `${color}[${timestamp}] [${level.toUpperCase()}] [${this.name}]${RESET}`;
    if (data !== undefined) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  debug(msg: string, data?: unknown): void { this.log('debug', msg, data); }
  info(msg: string, data?: unknown): void { this.log('info', msg, data); }
  warn(msg: string, data?: unknown): void { this.log('warn', msg, data); }
  error(msg: string, data?: unknown): void { this.log('error', msg, data); }
}

export function createLogger(name: string): Logger {
  const level = (process.env['LOG_LEVEL'] ?? 'info') as LogLevel;
  return new Logger(name, level);
}
