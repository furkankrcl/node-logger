// Jest test file for Colors
import { Colors } from "../../utils/Colors";
import { LogLevel } from "../../core/transports";

describe("Colors", () => {
  describe("applyColor", () => {
    it("should apply the correct color for debug level", () => {
      const message = "This is a debug message.";
      const coloredMessage = Colors.applyColor(LogLevel.DEBUG, message);
      expect(coloredMessage).toBe(`\x1b[34m${message}\x1b[0m`); // Blue
    });

    it("should apply the correct color for info level", () => {
      const message = "This is an info message.";
      const coloredMessage = Colors.applyColor(LogLevel.INFO, message);
      expect(coloredMessage).toBe(`\x1b[32m${message}\x1b[0m`); // Green
    });

    it("should apply the correct color for warn level", () => {
      const message = "This is a warning message.";
      const coloredMessage = Colors.applyColor(LogLevel.WARN, message);
      expect(coloredMessage).toBe(`\x1b[33m${message}\x1b[0m`); // Yellow
    });

    it("should apply the correct color for error level", () => {
      const message = "This is an error message.";
      const coloredMessage = Colors.applyColor(LogLevel.ERROR, message);
      expect(coloredMessage).toBe(`\x1b[31m${message}\x1b[0m`); // Red
    });

    it("should not apply any color for invalid level", () => {
      const message = "This is an invalid log level message.";
      const coloredMessage = Colors.applyColor("invalid" as LogLevel, message);
      expect(coloredMessage).toBe(`\x1b[0m${message}\x1b[0m`); // No color
    });
  });
});
