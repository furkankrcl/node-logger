export class TimeUtils {
  /**
   * Şu anki zamanı ISO 8601 formatında döner.
   * Örn: 2025-01-26T12:34:56.789Z
   */
  public static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Tarihi okunabilir bir formata çevirir.
   * Örn: 26/01/2025 15:30:45
   * @param date Opsiyonel olarak tarih nesnesi (Varsayılan: Şu anki zaman)
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
