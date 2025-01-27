import { LogLevel } from "../core/transports/Transport";

export class Colors {
  private static levelColors: Record<LogLevel, string> = {
    debug: "\x1b[34m", // blue
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
  };
  private static resetColor = "\x1b[0m";

  public static applyColor(level: LogLevel, message: string): string {
    const color = this.levelColors[level] || this.resetColor;
    return `${color}${message}\x1b[0m`;
  }

  private static extractLogLevel(message: string): LogLevel {
    const levelMatch = message.match(/\[(debug|info|warn|error)\]/i);
    return levelMatch
      ? (levelMatch[1].toLowerCase() as LogLevel)
      : LogLevel.INFO;
  }

  public static applyDynamicColor(message: string): string {
    const logLevel = Colors.extractLogLevel(message);
    const color = this.levelColors[logLevel] || this.resetColor;
    return `${color}${message}${this.resetColor}`;
  }
}
