import { ITransport, LogLevel } from "./Transport";
import { IFormatter } from "../formatters";

export class ConsoleTransport implements ITransport {
  public level: LogLevel;
  public formatter: IFormatter;
  public isActive: boolean;

  constructor(level: LogLevel, formatter: IFormatter, isActive = true) {
    this.level = level;
    this.formatter = formatter;
    this.isActive = isActive;
  }

  public send(formattedMessage: string): void {
    console.log(formattedMessage);
  }
}
