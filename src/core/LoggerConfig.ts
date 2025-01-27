import { ITransport } from "./transports";

export interface LoggerConfigOptions {
  transports: ITransport[];
}

export class LoggerConfig {
  private static instance: LoggerConfig | null = null;
  private transports: ITransport[];

  private constructor(options: LoggerConfigOptions) {
    this.transports = options.transports;
  }

  public static init(options: LoggerConfigOptions): void {
    if (!LoggerConfig.instance) {
      LoggerConfig.instance = new LoggerConfig(options);
    } else {
      throw new Error("LoggerConfig has already been initialized.");
    }
  }

  public static getInstance(): LoggerConfig {
    if (!LoggerConfig.instance) {
      throw new Error("LoggerConfig has not been initialized yet.");
    }
    return LoggerConfig.instance;
  }

  public getTransports(): ITransport[] {
    return this.transports;
  }
}
