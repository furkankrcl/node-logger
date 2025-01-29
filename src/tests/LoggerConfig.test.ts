import { LoggerConfig } from "../core/LoggerConfig";
import { ITransport } from "../core/transports/ITransport";

describe("LoggerConfig", () => {
  let mockTransport: jest.Mocked<ITransport>;

  beforeEach(() => {
    (LoggerConfig as any).instance = null;
    mockTransport = {
      log: jest.fn(),
    } as unknown as jest.Mocked<ITransport>;
  });

  it("should initialize with given transports and category transports", () => {
    LoggerConfig.init({
      transports: [mockTransport],
      categoryTransports: { category1: [mockTransport] },
    });

    const config = LoggerConfig.getInstance();

    expect(config.getTransports()).toEqual([mockTransport]);
    expect(config.getTransports("category1")).toEqual([mockTransport]);
  });

  it("should throw an error if initialized more than once", () => {
    LoggerConfig.init({
      transports: [],
    });

    expect(() => {
      LoggerConfig.init({
        transports: [],
      });
    }).toThrow("LoggerConfig has already been initialized.");
  });

  it("should throw an error if getInstance is called before initialization", () => {
    expect(() => {
      LoggerConfig.getInstance();
    }).toThrow("LoggerConfig has not been initialized yet.");
  });

  it("should return default transports if no category is provided", () => {
    LoggerConfig.init({
      transports: [mockTransport],
    });

    const config = LoggerConfig.getInstance();

    expect(config.getTransports()).toEqual([mockTransport]);
  });

  it("should return category-specific transports if category is provided", () => {
    LoggerConfig.init({
      transports: [],
      categoryTransports: { category1: [mockTransport] },
    });

    const config = LoggerConfig.getInstance();

    expect(config.getTransports("category1")).toEqual([mockTransport]);
  });

  it("should return default transports if category is not found", () => {
    LoggerConfig.init({
      transports: [mockTransport],
      categoryTransports: { category1: [mockTransport] },
    });

    const config = LoggerConfig.getInstance();

    expect(config.getTransports("nonexistentCategory")).toEqual([
      mockTransport,
    ]);
  });
});
