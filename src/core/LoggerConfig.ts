import { ITransport } from "./transports/ITransport";

interface LoggerConfigOptions {
  transports: ITransport[];
  categoryTransports?: Record<string, ITransport[]>;
}

export class LoggerConfig {
  private static instance: LoggerConfig | null = null;
  private transports: ITransport[];
  private categoryTransports: Record<string, ITransport[]> = {};

  private constructor(options: LoggerConfigOptions) {
    this.transports = options.transports;
    if (options.categoryTransports) {
      this.categoryTransports = options.categoryTransports;
    }
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

  public getTransports(category?: string): ITransport[] {
    if (category && this.categoryTransports[category]) {
      return this.categoryTransports[category];
    }
    return this.transports;
  }
}
