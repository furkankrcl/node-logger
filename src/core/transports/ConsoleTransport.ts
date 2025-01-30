import { ITransport, TransportOptions } from "./ITransport";

export class ConsoleTransport extends ITransport {
  constructor(options: TransportOptions) {
    super(options);
  }

  public send(formattedMessage: string): void {
    console.log(formattedMessage);
  }
}
