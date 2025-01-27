import { ITransport, LogLevel } from "./Transport";
import { IFormatter } from "../formatters/Formatter";

export class ConsoleTransport implements ITransport {
  level: LogLevel;
  formatter: IFormatter;
  isActive: boolean;

  constructor(level: LogLevel, formatter: IFormatter, isActive = true) {
    this.level = level;
    this.formatter = formatter;
    this.isActive = isActive;
  }

  send(formattedMessage: string): void {
    console.log(formattedMessage);
  }
}
