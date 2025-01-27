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
