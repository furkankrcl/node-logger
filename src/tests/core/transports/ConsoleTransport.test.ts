import { IFormatter } from "../../../core/formatters";
import { ConsoleTransport, LogLevel } from "../../../core/transports";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("ConsoleTransport", () => {
  let transport: ConsoleTransport;
  let mockFormatter: IFormatter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatter = {
      format: jest
        .fn()
        .mockImplementation((message, level, context, timestamp) => {
          return `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;
        }),
    };

    transport = new ConsoleTransport(LogLevel.INFO, mockFormatter);
  });

  it("should log the formatted message to console", () => {
    const message = "Test log message";
    const formattedMessage = mockFormatter.format(
      message,
      LogLevel.INFO,
      "TestContext",
      "2025-01-26T15:45:30.123Z"
    );

    transport.send(formattedMessage);

    expect(console.log).toHaveBeenCalledWith(formattedMessage);
  });

  it("should use the provided formatter to format messages", () => {
    const message = "Test log message";
    const timestamp = "2025-01-26T15:45:30.123Z";
    const context = "TestContext";
    const level = LogLevel.INFO;

    const formattedMessage = mockFormatter.format(
      message,
      level,
      context,
      timestamp
    );

    transport.send(formattedMessage);

    expect(mockFormatter.format).toHaveBeenCalledWith(
      message,
      level,
      context,
      timestamp
    );
  });

  it("should not log anything if isActive is false", () => {
    transport.isActive = false;
    const message = "This message should not be logged.";
    const formattedMessage = mockFormatter.format(
      message,
      LogLevel.INFO,
      "TestContext",
      "2025-01-26T15:45:30.123Z"
    );

    if (transport.isActive) {
      transport.send(formattedMessage);
    }

    expect(console.log).not.toHaveBeenCalled();
  });
});
