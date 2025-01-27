// Jest test file for TextFormatter

import { TextFormatter } from "../../../core/formatters";
import { LogLevel } from "../../../core/transports";
import { Colors } from "../../../utils/Colors";

jest.mock("../../../utils/Colors", () => ({
  Colors: {
    applyColor: jest.fn((level, message) => `colored-${level}-${message}`),
  },
}));

describe("TextFormatter", () => {
  describe("format", () => {
    it("should format message without color when useColor is false", () => {
      const formatter = new TextFormatter(false);
      const message = "This is a test message.";
      const level = LogLevel.INFO;
      const context = "TestContext";
      const timestamp = "2025-01-26T15:45:30.123Z";

      const formattedMessage = formatter.format(
        message,
        level,
        context,
        timestamp
      );
      const expected = `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;

      expect(formattedMessage).toBe(expected);
    });

    it("should format message with color when useColor is true", () => {
      const formatter = new TextFormatter(true);
      const message = "This is a test message.";
      const level = LogLevel.WARN;
      const context = "TestContext";
      const timestamp = "2025-01-26T15:45:30.123Z";

      const formattedMessage = formatter.format(
        message,
        level,
        context,
        timestamp
      );
      const expected = `colored-${level}-[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;

      expect(formattedMessage).toBe(expected);
    });

    it("should handle special characters in message", () => {
      const formatter = new TextFormatter(false);
      const message = "Special chars: \" ' \n \t ";
      const level = LogLevel.DEBUG;
      const context = "SpecialContext";
      const timestamp = "2025-01-26T15:45:30.123Z";

      const formattedMessage = formatter.format(
        message,
        level,
        context,
        timestamp
      );
      const expected = `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;

      expect(formattedMessage).toBe(expected);
    });

    it("should call Colors.applyColor when useColor is true", () => {
      const formatter = new TextFormatter(true);
      const message = "This is a test message.";
      const level = LogLevel.ERROR;
      const context = "TestContext";
      const timestamp = "2025-01-26T15:45:30.123Z";

      formatter.format(message, level, context, timestamp);

      expect(Colors.applyColor).toHaveBeenCalledWith(
        level,
        `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`
      );
    });
  });
});
