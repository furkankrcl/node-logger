# logger

`@furkankrcl/logger` is a library designed to meet the logging needs in Node.js projects. It can be easily integrated and is also customizable. With this library, you can easily perform standard logging operations and develop customized solutions according to your needs.

## 1. 📖 Other Languages

- [Türkçe (README.tr.md)](README.tr.md)

## 🚀 Features

- **Flexible Transport Mechanisms**: Provides predefined transport mechanisms such as console, file, or API. You can also create your own transport classes by deriving from the [`ITransport`](#52-itransport-interface) interface.
- **Category-Based Logging**: Manage logs in your application more systematically by defining different log categories.
- **Customizable Formatting**: Define your own log formats by deriving from the [`IFormatter`](#51-iformatter-interface) interface or use the built-in [`JsonFormatter`](#512-jsonformatter-class) and [`TextFormatter`](#511-textformatter-class) classes.
- **TypeScript Support**: Facilitates the development process with strong type support.

The library offers a structure open to custom developments in addition to standard solutions. For example:

- You can create your own [`ITransport`](#52-itransport-interface) class to send logs to a custom destination.
- If a different log format is required, you can define a new formatter using the [`IFormatter`](#51-iformatter-interface) interface.

## 3. 🛠️ Installation

Install the package using npm or yarn:

```bash
npm install @furkankrcl/logger
# or
yarn add @furkankrcl/logger
```

## 4. 📚 Usage and Examples

### 4.1. Basic Usage

In this example, logs at DEBUG level and above are written to the console, while logs at INFO level and above are written to a file named app.log.

```typescript
import {
  Logger,
  LoggerConfig,
  ConsoleTransport,
  FileTransport,
  LogLevel,
  TextFormatter,
} from "@furkankrcl/logger";

// Initialize LoggerConfig
LoggerConfig.init({
  transports: [
    new ConsoleTransport({
      level: LogLevel.DEBUG,
      formatter: new TextFormatter(true),
    }),
    new FileTransport(
      {
        level: LogLevel.INFO,
        formatter: new TextFormatter(false),
      },
      {
        filePath: "./logs/app.log",
      }
    ),
  ],
});

// Create a Logger instance
const logger = new Logger("MyApp");

// Log messages
logger.debug("This is a debug message");
logger.info("This is an info message");
logger.warn("This is a warning message");
logger.error("This is an error message");
```

### 4.2. Category-Based Logging

```typescript
import {
  Logger,
  LoggerConfig,
  ConsoleTransport,
  ApiTransport,
  LogLevel,
  TextFormatter,
  JsonFormatter,
} from "@furkankrcl/logger";

LoggerConfig.init({
  transports: [
    new ConsoleTransport({
      level: LogLevel.DEBUG,
      formatter: new TextFormatter(true),
    }),
  ],
  categoryTransports: {
    db: [
      new ApiTransport(
        { level: LogLevel.ERROR, formatter: new JsonFormatter() },
        { endpoint: "https://example.com/logs" }
      ),
    ],
  },
});

const logger = new Logger("MyApp");

logger.info("This is an info message");
logger.category("db").error("Database connection failed.");
```

### 4.3. Custom Logging and Formatting

1. Creating the `CustomTransport` class:

```typescript
// path_to_file/CustomTransport.ts
import {
  IFormatter,
  ITransport,
  LogLevel,
  TransportOptions,
} from "@furkankrcl/logger";

export class CustomTransport extends ITransport {
  constructor(options: TransportOptions) {
    super(options);
  }

  send(formattedMessage: string): void {
    console.log("Custom Transport: ", formattedMessage);
  }
}
```

2. Creating the `CustomFormatter` class:

```typescript
// path_to_file/CustomFormatter.ts
import { IFormatter, LogLevel } from "@furkankrcl/logger";

export class CustomFormatter implements IFormatter {
  format(message: string, level: LogLevel, context: string, timestamp: string) {
    return `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;
  }
}
```

3. Usage:

```typescript
import { LoggerConfig, LogLevel } from "@furkankrcl/logger";
import { CustomTransport } from "path_to_file/CustomTransport";
import { CustomFormatter } from "path_to_file/CustomFormatter";

LoggerConfig.init({
  transports: [
    new CustomTransport({
      level: LogLevel.DEBUG,
      formatter: new CustomFormatter(),
    }),
  ],
});
```

## 5. 🧩 Objects and Properties

### 5.1. IFormatter Interface

`IFormatter` is an interface used to convert log messages into a specific format. Classes derived from this interface can customize log formatting operations.

| Method   | Description            | Parameters                                                      | Return Type |
| -------- | ---------------------- | --------------------------------------------------------------- | ----------- |
| `format` | Formats a log message. | `message: string`: Log message                                  | string      |
|          |                        | `level: LogLevel`: Log level (`debug`, `info`, `warn`, `error`) |             |
|          |                        | `context: string`: Log context                                  |             |
|          |                        | `timestamp: string`: Log timestamp                              |             |

#### 5.1.1. TextFormatter Class

`TextFormatter` is a class that converts log messages into a text-based format. This class is generally suitable for terminal or file logging.

##### Constructor

| Parameter   | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| `useColors` | If `true`, coloring is applied based on log levels, otherwise plain text format is used. |

> For properties and methods, see the [IFormatter](#51-iformatter-interface) interface.

#### 5.1.2. JsonFormatter Class

`JsonFormatter` is a class that converts log messages into JSON format. This class is especially used for writing logs in JSON format to APIs or files.

> For properties and methods, see the [IFormatter](#51-iformatter-interface) interface.

### 5.2. ITransport Interface

`ITransport` is an abstract class that defines the transport mechanisms used for transmitting log messages. Classes derived from this class can direct log messages to different destinations.

###### Constructor

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| options   | Parameter containing transport configurations. |

- **options**

  | Property/Method | Description                                                           | Default | Type         |
  | --------------- | --------------------------------------------------------------------- | ------- | ------------ |
  | `level`         | Determines the log level. Log messages below this level are not sent. | N/A     | `LogLevel`   |
  | `isActive`      | Indicates whether the transport is active.                            | `true`  | `boolean`    |
  | `formatter`     | Formatter used to format messages.                                    | N/A     | `IFormatter` |

#### 5.2.1. ConsoleTransport Class

`ConsoleTransport` is a transport class used to write log messages to the terminal. It can apply coloring based on log levels.

> For constructor parameters and properties, see the [ITransport](#52-itransport-interface) interface.

#### 5.2.2. FileTransport Class

`FileTransport` is a transport class used to write log messages to a file. It supports file rotation when a certain file size is exceeded.

**File Rotation Feature**

`FileTransport` rotates the current file and creates a new one when the specified file size limit (`maxSizeInMB`) is exceeded. The name of the rotated file is enriched with a timestamp.

> Example Output
>
> - If the log file exceeds the size limit:
> - `application.log` → `application.log.2025-01-28T12-00-00Z`
>   New log messages continue to be written to the newly created `application.log` file.

##### Constructor

The constructor of the `FileTransport` class takes the following parameters:

| Parameter              | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `options`              | (For more information, see the [ITransport](#52-itransport-interface) options description.) |
| `fileTransportOptions` | Parameter containing file storage configurations.                                           |

- **`fileTransportOptions`**

  | Parameter     | Description                                                                      | Default |
  | ------------- | -------------------------------------------------------------------------------- | ------- |
  | `filePath`    | Path of the file where logs will be written.                                     | N/A     |
  | `maxSizeInMB` | File size limit (in megabytes). The file is rotated when this limit is exceeded. | `5`     |

#### 2.3. ApiTransport Class

`ApiTransport` is a transport class used to send log messages to an API. It includes a retry mechanism and transmits log messages as API requests.

##### Constructor

The constructor of the `ApiTransport` class takes the following parameters:

| Parameter             | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `options`             | (For more information, see the [ITransport](#52-itransport-interface) options description.) |
| `apiTransportOptions` | Parameter containing API request configurations.                                            |

- **`apiTransportOptions`:**

  | Property     | Description                                                           | Default |
  | ------------ | --------------------------------------------------------------------- | ------- |
  | `endpoint`   | The API endpoint where log messages will be sent.                     | N/A     |
  | `headers`    | HTTP headers that need to be included in the request.                 | N/A     |
  | `method`     | The type of the outgoing request.                                     | `POST`  |
  | `retries`    | The number of retry attempts for failed requests.                     | `3`     |
  | `retryDelay` | The delay in milliseconds between retry attempts for failed requests. | `1000`  |

## ⚠️ Warnings

- Ensure that the `LoggerConfig.init` static method is called only once and before creating a new `Logger` reference.
- Regularly check the size of log files and disk usage when using the library.
- Ensure that logs do not contain sensitive information when logging to an API.
- Choose appropriate log levels and transport mechanisms according to your performance requirements.
- Pay attention to performance and security when customizing log formatters and transport mechanisms.
- Set appropriate file size limits to avoid data loss during file rotation.
- Ensure that the retry mechanism is correctly configured when logging to an API.
- Prevent unnecessary log production by setting log levels correctly.

## 📜 License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license. For more information, see the [`LICENSE`](./LICENSE) file.

## 🤝 Contributing

If you would like to contribute, please send a pull request or open an issue.
