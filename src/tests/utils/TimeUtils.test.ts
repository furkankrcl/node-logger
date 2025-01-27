// Jest test file for TimeUtils
import { TimeUtils } from "../../utils/TimeUtils";

describe("TimeUtils", () => {
  describe("getCurrentTimestamp", () => {
    it("should return the current time in ISO 8601 format", () => {
      const timestamp = TimeUtils.getCurrentTimestamp();
      const now = new Date().toISOString();

      // Compare only up to seconds to avoid millisecond differences
      expect(timestamp.substring(0, 19)).toBe(now.substring(0, 19));
    });

    it("should return a valid ISO 8601 string", () => {
      const timestamp = TimeUtils.getCurrentTimestamp();
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

      expect(timestamp).toMatch(isoRegex);
    });
  });
});
