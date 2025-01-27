import { JsonFormatter } from "../../../core/formatters";
import { LogLevel } from "../../../core/transports";

describe("JsonFormatter", () => {
  let formatter: JsonFormatter;

  beforeEach(() => {
    formatter = new JsonFormatter();
  });

  it("should format log message into valid JSON", () => {
    const message = "This is a test message.";
    const level = LogLevel.INFO;
    const context = "TestContext";
    const timestamp = "2025-01-26T15:45:30.123Z";

    const formatted = formatter.format(message, level, context, timestamp);
    const expected = {
      timestamp,
      context,
      level,
      message,
    };

    expect(JSON.parse(formatted)).toEqual(expected);
  });

  it("should include correct log level", () => {
    const message = "This is a debug message.";
    const level = LogLevel.DEBUG;
    const context = "TestContext";
    const timestamp = "2025-01-26T15:45:30.123Z";

    const formatted = formatter.format(message, level, context, timestamp);
    const parsed = JSON.parse(formatted);

    expect(parsed.level).toBe(LogLevel.DEBUG);
  });

  it("should handle empty message", () => {
    const message = "";
    const level = LogLevel.WARN;
    const context = "TestContext";
    const timestamp = "2025-01-26T15:45:30.123Z";

    const formatted = formatter.format(message, level, context, timestamp);
    const parsed = JSON.parse(formatted);

    expect(parsed.message).toBe("");
  });

  it("should handle special characters in message", () => {
    const message = "This is a test with special characters: \" ' \n \t ";
    const level = LogLevel.ERROR;
    const context = "SpecialContext";
    const timestamp = "2025-01-26T15:45:30.123Z";

    const formatted = formatter.format(message, level, context, timestamp);
    const parsed = JSON.parse(formatted);

    expect(parsed.message).toBe(message);
  });
});
