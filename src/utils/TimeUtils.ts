export class TimeUtils {
  /**
   * Returns the current time in ISO 8601 format.
   * Example: 2025-01-26T12:34:56.789Z
   */
  public static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}
