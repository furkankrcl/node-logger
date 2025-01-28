import { ITransport, LogLevel } from "./Transport";
import { IFormatter } from "../formatters";
import * as fs from "fs";
import * as path from "path";

export class FileTransport implements ITransport {
  private filePath: string;
  private maxSizeInBytes: number;

  public level: LogLevel;
  public formatter: IFormatter;
  public isActive: boolean;

  /**
   * @param level - The log level for this transport.
   * @param formatter - The formatter used to format log messages.
   * @param filePath - The path to the log file.
   * @param maxSizeInMB - The maximum size of the log file in megabytes before it is rotated. Defaults to 5 MB.
   * @param isActive - Indicates whether the transport is active. Defaults to true.
   */
  constructor(
    level: LogLevel,
    formatter: IFormatter,
    filePath: string,
    maxSizeInMB: number = 5,
    isActive = true
  ) {
    this.level = level;
    this.formatter = formatter;
    this.filePath = filePath;
    this.maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    this.isActive = isActive;
    this.ensureLogFile();
  }

  send(formattedMessage: string): void {
    this.rotateIfNeeded();
    fs.appendFileSync(this.filePath, formattedMessage + "\n", "utf8");
  }

  private ensureLogFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "", "utf8");
    }
  }

  // Dosya boyutunu kontrol eder ve gerekirse döndürür
  private rotateIfNeeded(): void {
    const stats = fs.statSync(this.filePath);
    if (stats.size >= this.maxSizeInBytes) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const rotatedFilePath = `${this.filePath}.${timestamp}`;
      fs.renameSync(this.filePath, rotatedFilePath);
      this.ensureLogFile();
    }
  }
}
