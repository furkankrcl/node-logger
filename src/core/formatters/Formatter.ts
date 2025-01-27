import { LogLevel } from "../transports/Transport";

export interface IFormatter {
  format(
    message: string,
    level: LogLevel,
    context: string,
    timestamp: string
  ): string;
}
