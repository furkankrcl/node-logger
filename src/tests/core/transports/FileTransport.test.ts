import * as fs from "fs";
import { FileTransport, LogLevel } from "../../../core/transports";
import { IFormatter } from "../../../core/formatters";

jest.mock("fs");

describe("FileTransport", () => {
  let transport: FileTransport;
  let mockFormatter: IFormatter;
  const mockFilePath = "logs/app.log";

  beforeEach(() => {
    jest.clearAllMocks();

    mockFormatter = {
      format: jest
        .fn()
        .mockImplementation((message, level, context, timestamp) => {
          return `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;
        }),
    };

    transport = new FileTransport(
      LogLevel.INFO,
      mockFormatter,
      mockFilePath,
      1
    );
  });

  it("should write formatted message to the file", () => {
    jest.spyOn(fs, "statSync").mockReturnValue({ size: 0 } as any);
    const message = "Test log message";
    const formattedMessage = mockFormatter.format(
      message,
      LogLevel.INFO,
      "TestContext",
      "2025-01-26T15:45:30.123Z"
    );

    transport.send(formattedMessage);

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      mockFilePath,
      formattedMessage + "\n",
      "utf8"
    );
  });

  it("should rotate the file when max size is exceeded", () => {
    const message = "Test log message";
    const formattedMessage = mockFormatter.format(
      message,
      LogLevel.INFO,
      "TestContext",
      "2025-01-26T15:45:30.123Z"
    );

    jest.spyOn(fs, "statSync").mockReturnValue({ size: 1024 * 1024 } as any); // Simulate max size reached

    transport.send(formattedMessage);

    const rotatedFilePath = `${mockFilePath}.2025-01-26T15-45-30-123Z`;
    expect(fs.renameSync).toHaveBeenCalledWith(
      mockFilePath,
      expect.any(String)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockFilePath, "", "utf8");
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

  it("should not write to the file if isActive is false", () => {
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

    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });
});
