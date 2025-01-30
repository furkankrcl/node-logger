import { IFormatter } from "../formatters/IFormatter";
import { LogLevel } from "../LogLevel";

export interface TransportOptions {
  /** The minimum log level this transport should handle. */
  level: LogLevel;
  /** The formatter used to format log messages. */
  formatter: IFormatter;
  /** Indicates whether the transport is active. */
  isActive?: boolean;
}

/**
 * Defines the structure of a transport for logging.
 */
export abstract class ITransport {
  public readonly level: LogLevel;
  public readonly formatter: IFormatter;
  public readonly isActive: boolean;

  constructor({ formatter, level, isActive = true }: TransportOptions) {
    this.level = level;
    this.formatter = formatter;
    this.isActive = isActive;
  }

  /**
   * Sends a log message using the transport.
   * @param formattedMessage - The formatted log message.
   */
  public abstract send(formattedMessage: string): void;
}
