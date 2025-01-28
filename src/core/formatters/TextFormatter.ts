import { IFormatter } from "./Formatter";
import { LogLevel } from "../transports";
import { Colors } from "../../utils/Colors";

export class TextFormatter implements IFormatter {
  private useColor: boolean;
  /**
   * @param useColor - A boolean indicating whether to apply color to the formatted log messages.
   */
  constructor(useColor: boolean) {
    this.useColor = useColor;
  }
  public format(
    message: string,
    level: LogLevel,
    context: string,
    timestamp: string
  ): string {
    const formattedMesage = `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;
    if (this.useColor) {
      return Colors.applyColor(level, formattedMesage);
    }
    return formattedMesage;
  }
}
