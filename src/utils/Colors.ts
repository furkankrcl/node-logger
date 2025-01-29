import { LogLevel } from "src/core/LogLevel";

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
    return `${color}${message}${this.resetColor}`;
  }
}
