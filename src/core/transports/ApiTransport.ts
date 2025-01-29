import { ITransport } from "./ITransport";
import * as https from "https";
import * as http from "http";
import { URL } from "url";
import { LogLevel } from "../LogLevel";
import { IFormatter } from "../formatters/IFormatter";

/**
 * Options for configuring the API transport.
 */
interface ApiTransportOptions {
  /**
   * The URL endpoint to which the logs will be sent.
   */
  endpoint: string;
  /**
   * Optional headers to include in the API request.
   */
  headers?: Record<string, string>;
  /**
   * The HTTP method to use for the API request. Defaults to "POST".
   */
  method?: "POST" | "PUT";
  /**
   * The number of times to retry the request in case of failure. Defaults to 3.
   */
  retries?: number;
  /**
   * The delay in milliseconds between retry attempts. Defaults to 1000.
   */
  retryDelay?: number;
}

export class ApiTransport implements ITransport {
  private options: ApiTransportOptions;
  public level: LogLevel;
  public formatter: IFormatter;
  public isActive: boolean;

  /**
   * @param level - The log level to be used by this transport.
   * @param formatter - The formatter to format log messages.
   * @param options - The options for the API transport, including endpoint, method, headers, retries, and retryDelay.
   * @param isActive - A boolean indicating whether the transport is active. Defaults to true.
   */
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

  public async send(formattedMessage: string): Promise<void> {
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
