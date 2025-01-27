import { LoggerConfig } from "./LoggerConfig";
import { LogLevel } from "./transports/Transport";
import { TimeUtils } from "../utils/TimeUtils";

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(level: LogLevel, message: string): void {
    const transports = LoggerConfig.getInstance().getTransports();
    const timestamp = TimeUtils.getCurrentTimestamp();

    transports.forEach((transport) => {
      if (transport.isActive && this.shouldLog(level, transport.level)) {
        const formattedMessage = transport.formatter.format(
          message,
          level,
          this.context,
          timestamp
        );
        transport.send(formattedMessage);
      }
    });
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  private shouldLog(level: LogLevel, transportLevel: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(transportLevel);
  }
}
