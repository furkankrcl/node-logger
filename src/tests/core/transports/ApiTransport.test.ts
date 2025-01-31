import * as http from "http";
import * as https from "https";
import { ApiTransport } from "../../../core/transports/ApiTransport";
import { IFormatter } from "../../../core/formatters/IFormatter";
import { LogLevel } from "../../../core/LogLevel";

jest.mock("http");
jest.mock("https");

describe("ApiTransport", () => {
  let transport: ApiTransport;
  let mockFormatter: IFormatter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatter = {
      format: jest
        .fn()
        .mockImplementation((message, level, context, timestamp) => {
          return JSON.stringify({ message, level, context, timestamp });
        }),
    };

    transport = new ApiTransport(
      { level: LogLevel.INFO, formatter: mockFormatter },
      {
        endpoint: "https://example.com/logs",
        headers: { Authorization: "Bearer token" },
        retries: 2,
        retryDelay: 100,
      }
    );
  });

  it("should send a formatted message", async () => {
    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 200, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await transport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "example.com",
        path: "/logs",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      }),
      expect.any(Function)
    );
  });

  it("should retry on failure and eventually succeed", async () => {
    const mockRequest = jest
      .fn()
      .mockImplementationOnce((options, callback) => {
        const res = { statusCode: 500, on: jest.fn() };
        callback(res);
        return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
      })
      .mockImplementationOnce((options, callback) => {
        const res = { statusCode: 200, on: jest.fn() };
        callback(res);
        return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
      });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await transport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it("should stop retrying after reaching the maximum number of retries and not send the log", async () => {
    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 500, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await expect(transport.send("Test log message")).resolves.toBeUndefined();
    expect(mockRequest).toHaveBeenCalledTimes(2); // retries: 2
  });

  it("should set the correct request options for HTTP", async () => {
    const httpTransport = new ApiTransport(
      { level: LogLevel.INFO, formatter: mockFormatter },
      {
        endpoint: "http://example.com/logs",
        headers: { Authorization: "Bearer token" },
        retries: 2,
        retryDelay: 100,
      }
    );

    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 200, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (http.request as jest.Mock).mockImplementation(mockRequest);

    await httpTransport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "example.com",
        path: "/logs",
        port: 80,
        method: "POST",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      }),
      expect.any(Function)
    );
  });

  it("should set the correct request options for HTTPS", async () => {
    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 200, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await transport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "example.com",
        path: "/logs",
        port: 443,
        method: "POST",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      }),
      expect.any(Function)
    );
  });

  it("should set the correct request options with custom method", async () => {
    const customMethodTransport = new ApiTransport(
      { level: LogLevel.INFO, formatter: mockFormatter },
      {
        endpoint: "https://example.com/logs",
        headers: { Authorization: "Bearer token" },
        method: "PUT",
        retries: 2,
        retryDelay: 100,
      }
    );

    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 200, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await customMethodTransport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "example.com",
        path: "/logs",
        port: 443,
        method: "PUT",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      }),
      expect.any(Function)
    );
  });

  it("should set the correct request options when headers are undefined", async () => {
    const noHeaderTransport = new ApiTransport(
      { level: LogLevel.INFO, formatter: mockFormatter },
      {
        endpoint: "https://example.com/logs",
        retries: 2,
        retryDelay: 100,
      }
    );

    const mockRequest = jest.fn((options, callback) => {
      const res = { statusCode: 200, on: jest.fn() };
      callback(res);
      return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
    });
    (https.request as jest.Mock).mockImplementation(mockRequest);

    await noHeaderTransport.send("Test log message");

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: "example.com",
        path: "/logs",
        port: 443,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      expect.any(Function)
    );
  });
});
