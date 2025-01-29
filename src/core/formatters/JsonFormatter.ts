import { LogLevel } from "../LogLevel";
import { IFormatter } from "./IFormatter";

export class JsonFormatter implements IFormatter {
  public format(
    message: string,
    level: LogLevel,
    context: string,
    timestamp: string
  ): string {
    return JSON.stringify({
      timestamp,
      context,
      level,
      message,
    });
  }
}
