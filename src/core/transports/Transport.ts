import { IFormatter } from "../formatters";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface ITransport {
  level: LogLevel;
  formatter: IFormatter;
  isActive: boolean;
  send(formattedMessage: string): void;
}
