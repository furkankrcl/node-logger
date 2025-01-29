import { IFormatter } from "../formatters/IFormatter";
import { LogLevel } from "../LogLevel";
import { ITransport } from "./ITransport";

export class ConsoleTransport implements ITransport {
  public level: LogLevel;
  public formatter: IFormatter;
  public isActive: boolean;

  /**
   * @param level - The log level to be used by this transport.
   * @param formatter - The formatter to format log messages.
   * @param isActive - A boolean indicating whether the transport is active. Defaults to true.
   */
  constructor(level: LogLevel, formatter: IFormatter, isActive = true) {
    this.level = level;
    this.formatter = formatter;
    this.isActive = isActive;
  }

  public send(formattedMessage: string): void {
    console.log(formattedMessage);
  }
}
