import { IFormatter } from "../formatters";

/**
 * Represents the log level for a transport.
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Defines the structure of a transport for logging.
 */
export interface ITransport {
  /**
   * The minimum log level this transport should handle.
   */
  level: LogLevel;

  /**
   * The formatter used to format log messages.
   */
  formatter: IFormatter;

  /**
   * Indicates whether the transport is active.
   */
  isActive: boolean;

  /**
   * Sends a log message using the transport.
   * @param formattedMessage - The formatted log message.
   */
  send(formattedMessage: string): void;
}
