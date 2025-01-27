export class TimeUtils {
  /**
   * Returns the current time in ISO 8601 format.
   * Example: 2025-01-26T12:34:56.789Z
   */
  public static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Converts the date to a readable format.
   * Example: 26/01/2025 15:30:45
   * @param date Optional date object (Default: Current time)
   */
  public static getReadableTimestamp(date: Date = new Date()): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}
