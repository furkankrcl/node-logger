import { LoggerConfig } from "../core/LoggerConfig";
import { Logger } from "../core/Logger";
import {
  ApiTransport,
  ConsoleTransport,
  FileTransport,
  LogLevel,
} from "../core/transports";
import { JsonFormatter, TextFormatter } from "../core/formatters";

LoggerConfig.init({
  transports: [
    new ConsoleTransport(LogLevel.DEBUG, new TextFormatter(true)),
    new FileTransport(
      LogLevel.INFO,
      new TextFormatter(false),
      "./logs/app.log",
      2
    ),
  ],
  categoryTransports: {
    db: [
      new ApiTransport(LogLevel.ERROR, new JsonFormatter(), {
        endpoint: "https://4f199b8aebb4489cb107a0c5fdcf676e.api.mockbin.io/",
        method: "POST",
        headers: {
          "User-Agent": "furkankrcl",
          Authorization: "Bearer my_token",
        },
        retries: 2,
        retryDelay: 1000,
      }),
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
