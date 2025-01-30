import { LoggerConfig } from "../core/LoggerConfig";
import { Logger } from "../core/Logger";
import { LogLevel } from "../core/LogLevel";
import { TextFormatter } from "../core/formatters/TextFormatter";
import { ConsoleTransport } from "../core/transports/ConsoleTransport";
import { FileTransport } from "../core/transports/FileTransport";
import { ApiTransport } from "../core/transports/ApiTransport";
import { JsonFormatter } from "../core/formatters/JsonFormatter";

LoggerConfig.init({
  transports: [
    new ConsoleTransport({
      level: LogLevel.DEBUG,
      formatter: new TextFormatter(true),
    }),
    new FileTransport(
      {
        level: LogLevel.INFO,
        formatter: new TextFormatter(false),
      },
      {
        filePath: "./logs/app.log",
        maxSizeInMB: 2,
      }
    ),
  ],
  categoryTransports: {
    db: [
      new ApiTransport(
        {
          level: LogLevel.ERROR,
          formatter: new JsonFormatter(),
        },
        {
          endpoint: "https://4f199b8aebb4489cb107a0c5fdcf676e.api.mockbin.io/",
          method: "POST",
          retries: 2,
          retryDelay: 1000,
        }
      ),
    ],
  },
});

const logger = new Logger("MyClass");

logger.debug("This is a debug log.");
logger.info("This is an info log.");
logger.warn("This is a warning log.");
logger.error("This is an error log.");

logger.category("db").warn("Database connection lost.");
logger.category("db").error("Database connection failed.");
