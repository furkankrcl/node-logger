import { LogLevel } from "../transports";

export interface IFormatter {
  format(
    message: string,
    level: LogLevel,
    context: string,
    timestamp: string
  ): string;
}
