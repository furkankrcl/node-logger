import { ITransport, LogLevel } from "./Transport";
import { IFormatter } from "../formatters/Formatter";
import * as https from "https";
import * as http from "http";
import { URL } from "url";

export interface ApiTransportOptions {
  endpoint: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
  retries?: number;
  retryDelay?: number;
}

export class ApiTransport implements ITransport {
  level: LogLevel;
  formatter: IFormatter;
  isActive: boolean;
  private options: ApiTransportOptions;

  constructor(
    level: LogLevel,
    formatter: IFormatter,
    options: ApiTransportOptions,
    isActive = true
  ) {
    this.level = level;
    this.formatter = formatter;
    this.options = { method: "POST", retries: 3, retryDelay: 1000, ...options };
    this.isActive = isActive;
  }

  async send(formattedMessage: string): Promise<void> {
    await this.retrySend(formattedMessage, this.options.retries);
  }

  private async retrySend(message: string, retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.performRequest(message);
        return;
      } catch (error) {
        if (attempt === retries) {
          console.error("Log sending failed after retries:", error);
          return;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, this.options.retryDelay)
        );
      }
    }
  }

  private performRequest(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.endpoint);
      const protocol = url.protocol === "https:" ? https : http;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname + url.search,
        method: this.options.method,
        headers: {
          "Content-Type": "application/json",
          ...(this.options.headers || {}),
        },
      };

      const req = protocol.request(requestOptions, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
        resolve();
      });

      req.on("close", resolve);
      req.on("error", reject);
      req.write(message);
      req.end();
    });
  }
}
