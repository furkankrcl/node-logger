// Jest test file for Logger
import { Logger } from "../core/Logger";
import { LoggerConfig } from "../core/LoggerConfig";
import { LogLevel } from "../core/LogLevel";
import { ITransport } from "../core/transports/ITransport";
import { TimeUtils } from "../utils/TimeUtils";

jest.mock("../core/LoggerConfig");
jest.mock("../utils/TimeUtils");

describe("Logger", () => {
  let mockTransport: jest.Mocked<ITransport>;

  beforeEach(() => {
    mockTransport = {
      level: LogLevel.INFO,
      isActive: true,
      formatter: {
        format: jest.fn((message, level, context, timestamp) => {
          return `[${timestamp}] [${context}] [${String(
            level
          ).toUpperCase()}] ${message}`;
        }),
      },
      send: jest.fn(),
    } as unknown as jest.Mocked<ITransport>;

    (
      LoggerConfig as jest.Mocked<typeof LoggerConfig>
    ).getInstance.mockReturnValue({
      getTransports: jest.fn().mockReturnValue([mockTransport]),
    } as any);

    (
      TimeUtils as jest.Mocked<typeof TimeUtils>
    ).getCurrentTimestamp.mockReturnValue("2025-01-27T12:00:00.000Z");
  });

  it("should log a message using the correct transport", () => {
    const logger = new Logger("TestContext");

    logger.info("Test message");

    expect(mockTransport.formatter.format).toHaveBeenCalledWith(
      "Test message",
      LogLevel.INFO,
      "TestContext",
      "2025-01-27T12:00:00.000Z"
    );

    expect(mockTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [INFO] Test message"
    );
  });

  it("should respect the log level hierarchy", () => {
    Object.defineProperty(mockTransport, "level", {
      value: LogLevel.WARN,
      writable: false,
    });

    const logger = new Logger("TestContext");

    logger.info("This should not be logged");

    expect(mockTransport.send).not.toHaveBeenCalled();

    logger.warn("This should be logged");

    expect(mockTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [WARN] This should be logged"
    );
  });

  it("should handle category-specific transports", () => {
    const categoryTransport: jest.Mocked<ITransport> = {
      ...mockTransport,
      level: LogLevel.DEBUG,
    };

    (
      LoggerConfig as jest.Mocked<typeof LoggerConfig>
    ).getInstance.mockReturnValue({
      getTransports: jest.fn((category?: string) => {
        if (category === "SpecialCategory") {
          return [categoryTransport];
        }
        return [mockTransport];
      }),
    } as any);

    const logger = new Logger("TestContext");

    logger.category("SpecialCategory").debug("Category-specific message");

    expect(categoryTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [DEBUG] Category-specific message"
    );
  });

  it("should reset the category after a log", () => {
    const logger = new Logger("TestContext");

    logger.category("SpecialCategory").info("First message");

    expect(mockTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [INFO] First message"
    );

    logger.info("Second message");

    expect(mockTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [INFO] Second message"
    );
  });

  it("should correctly determine if a message should be logged based on log levels", () => {
    const logger = new Logger("TestContext");

    const shouldLogSpy = jest.spyOn(logger as any, "shouldLog");

    logger.log(LogLevel.DEBUG, "This should not be logged");
    expect(shouldLogSpy).toHaveReturnedWith(false);

    logger.log(LogLevel.INFO, "This should be logged");
    expect(shouldLogSpy).toHaveReturnedWith(true);
  });

  it("should log an error message with LogLevel.ERROR", () => {
    const logger = new Logger("TestContext");

    logger.error("This is an error message");

    expect(mockTransport.formatter.format).toHaveBeenCalledWith(
      "This is an error message",
      LogLevel.ERROR,
      "TestContext",
      "2025-01-27T12:00:00.000Z"
    );

    expect(mockTransport.send).toHaveBeenCalledWith(
      "[2025-01-27T12:00:00.000Z] [TestContext] [ERROR] This is an error message"
    );
  });
});
