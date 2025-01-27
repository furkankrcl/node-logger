import { IFormatter } from "./Formatter";
import { LogLevel } from "../transports/Transport";

export class JsonFormatter implements IFormatter {
  format(
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
