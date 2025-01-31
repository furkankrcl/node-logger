import { ITransport, TransportOptions } from "./ITransport";
import * as fs from "fs";
import * as path from "path";

interface FileTransportOptions {
  /** The path to the log file. */
  filePath: string;
  /** The maximum size of the log file in megabytes before it is rotated. Defaults to 5 MB. */
  maxSizeInMB?: number;
}

export class FileTransport extends ITransport {
  private filePath: string;
  private maxSizeInBytes: number;

  constructor(
    options: TransportOptions,
    { filePath, maxSizeInMB = 5 }: FileTransportOptions
  ) {
    super(options);
    this.filePath = filePath;
    this.maxSizeInBytes = maxSizeInMB * 1024 * 1024;
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

  // Checks the file size and rotates if necessary
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
