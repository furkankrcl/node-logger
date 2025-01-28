import { LogLevel } from "../transports";

/**
 * Defines the structure of a formatter used by a transport.
 */
export interface IFormatter {
  /**
   * Formats a log message.
   * @param message - The log message to format.
   * @param level - The log level of the message.
   * @param context - The context in which the log was generated.
   * @param timestamp - The timestamp of the log message.
   * @returns The formatted log message.
   */
  format(
    message: string,
    level: LogLevel,
    context: string,
    timestamp: string
  ): string;
}
