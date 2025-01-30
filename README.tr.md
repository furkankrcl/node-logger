# logger

`@furkankrcl/logger`, Node.js projelerinde loglama ihtiyacını karşılamak için tasarlanmış bir kütüphane. Basit bir şekilde entegre edilebilir, aynı zamanda özelleştirilebilir bir yapıya sahip. Bu kütüphane ile hem standart loglama işlemlerini kolayca gerçekleştirebilir hem de kendi ihtiyaçlarınıza göre özelleştirilmiş çözümler geliştirebilirsiniz.

## 1. 📖 Diğer Diller

- [English (README.md)](README.md)

## 2. 🚀 Özellikler

- **Esnek Taşıma Mekanizmaları (Transports)**: Console, dosya veya API gibi önceden tanımlı taşıma mekanizmaları sunuluyor. [`ITransport`](#52-itransport-interface) arayüzünden türeterek kendi taşıma sınıflarınızı da oluşturabilirsiniz.
- **Kategori Bazlı Loglama**: Farklı log kategorileri tanımlayarak uygulamanızdaki logları daha düzenli bir şekilde yönetebilirsiniz.
- **Özelleştirilebilir Formatlama**: [`IFormatter`](#51-iformatter-interface) arayüzünden türeterek kendi log formatlarınızı tanımlayabilir veya hazır [`JsonFormatter`](#512-jsonformatter-class) ve [`TextFormatter`](#511-textformatter-class) sınıflarını kullanabilirsiniz.
- **TypeScript Desteği**: Güçlü tip desteğiyle geliştirme sürecinde kolaylık sağlar.

Kütüphane, standart çözümlerin yanı sıra, ihtiyaçlarınıza özel geliştirmelere açık bir yapı sunar. Örneğin:

- Özel bir ortama log göndermek için kendi [`ITransport`](#52-itransport-interface) sınıfınızı oluşturabilirsiniz.
- Farklı bir log formatı gerekiyorsa [`IFormatter`](#51-iformatter-interface) arayüzünü kullanarak yeni bir formatlayıcı tanımlayabilirsiniz.

## 3. 🛠️ Kurulum

Paketi npm veya yarn kullanarak yükleyin:

```bash
npm install @furkankrcl/logger
# veya
yarn add @furkankrcl/logger
```

## 4. 📚 Kullanım ve Örnekler

### 4.1. Temel Kullanım

Bu örnekte DEBUG ve üzeri seviyedeki logları konsola yazarken, INFO ve üzeri seviye logları app.log adlı bir dosyaya yazıyor.

```typescript
import {
  Logger,
  LoggerConfig,
  ConsoleTransport,
  FileTransport,
  LogLevel,
  TextFormatter,
} from "@furkankrcl/logger";

// LoggerConfig'i başlatın
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

// Bir Logger örneği oluşturun
const logger = new Logger("MyApp");

// Mesajları loglayın
logger.debug("Bu bir debug mesajıdır");
logger.info("Bu bir bilgi mesajıdır");
logger.warn("Bu bir uyarı mesajıdır");
logger.error("Bu bir hata mesajıdır");
```

### 4.2. Kategori Bazlı Loglama

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

logger.info("Bu bir bilgi mesajıdır");
logger.category("db").error("Veritabanı bağlantısı başarısız.");
```

### 4.3. Özel Loglama ve Formatla

1. `CustomTransport` sınıfının oluşturulması:

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

2. `CustomFormatter` sınıfının oluşturulması:

```typescript
// path_to_file/CustomFormatter.ts
import { IFormatter, LogLevel } from "@furkankrcl/logger";

export class CustomFormatter implements IFormatter {
  format(message: string, level: LogLevel, context: string, timestamp: string) {
    return `[${timestamp}] [${context}] [${level.toUpperCase()}] ${message}`;
  }
}
```

3. Kullanımı:

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

## 5. 🧩 Obje ve Özellikleri

### 5.1. IFormatter Interface

`IFormatter`, log mesajlarının belirli bir formata dönüştürülmesini sağlamak için kullanılan bir arayüzdür. Bu arayüzden türetilen sınıflar, log formatlama işlemlerini özelleştirebilir.

| Metod    | Açıklama                    | Parametreler                                                       | Dönüş Tipi |
| -------- | --------------------------- | ------------------------------------------------------------------ | ---------- |
| `format` | Bir log mesajını formatlar. | `message: string`: Log mesajı                                      | string     |
|          |                             | `level: LogLevel`: Log seviyesi (`debug`, `info`, `warn`, `error`) |            |
|          |                             | `context: string`: Logun bağlamı                                   |            |
|          |                             | `timestamp: string`: Logun zaman damgası                           |            |

#### 5.1.1. TextFormatter Class

`TextFormatter`, log mesajlarını metin tabanlı bir formatta dönüştüren bir sınıftır. Bu sınıf, genellikle terminal veya dosya loglaması için uygundur.

##### Constructor

| Parametre   | Açıklama                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `useColors` | `true` ise log seviyelerine göre renklendirme yapılır, aksi halde düz metin formatı kullanılır. |

> Özellik ve metodlar için [IFormatter](#51-iformatter-interface) interface'ine bakınız.

#### 5.1.2. JsonFormatter Class

`JsonFormatter`, log mesajlarını JSON formatında dönüştüren bir sınıftır. Bu sınıf, özellikle API'lere veya dosyalara JSON formatında log yazmak için kullanılır.

> Özellik ve metodlar için [IFormatter](#51-iformatter-interface) interface'ine bakınız.

### 5.2. ITransport Interface

`ITransport`, log mesajlarının iletimi için kullanılan taşıma mekanizmalarını tanımlayan bir soyut sınıftır. Bu sınıftan türetilen sınıflar, log mesajlarını farklı hedeflere yönlendirebilir.

###### Constructor

| Parametre | Açıklama                                          |
| --------- | ------------------------------------------------- |
| options   | Transform yapılandırmalarını içeren parametredir. |

- **options**

| Özellik/Metod | Açıklama                                                              | Varsayılan | Tip          |
| ------------- | --------------------------------------------------------------------- | ---------- | ------------ |
| `level`       | Log seviyesini belirler. Bu seviye altındaki log mesajları iletilmez. | N/A        | `LogLevel`   |
| `isActive`    | Taşımanın aktif olup olmadığını belirtir.                             | `true`     | `boolean`    |
| `formatter`   | Mesajları formatlamak için kullanılan formatlayıcı.                   | N/A        | `IFormatter` |

#### 5.2.1. ConsoleTransport Class

`ConsoleTransport`, log mesajlarını terminale yazdırmak için kullanılan bir taşıma sınıfıdır. Log seviyesine göre renklendirme yapabilir.

> constructor parametreleri ve özellikler hakkında bilgi için [ITransport](#52-itransport-interface) soyut sınıfına bakabilirsiniz.

#### 5.2.2. FileTransport Class

`FileTransport`, log mesajlarını bir dosyaya yazmak için kullanılan bir taşıma sınıfıdır. Belirli bir dosya boyutunu aştığında dosyayı döndürme (rotate) desteği sunar.

**Dosya Döndürme (Rotate) Özelliği**

`FileTransport`, belirtilen dosya boyut sınırını (`maxSizeInMB`) aştığında mevcut dosyayı döndürerek yeni bir dosya oluşturur. Döndürülen dosyanın adı, zaman damgası ile zenginleştirilir.

> Örnek Çıktı
>
> - Eğer log dosyası boyut sınırını aşarsa:
> - `application.log` → `application.log.2025-01-28T12-00-00Z`
>   Yeni log mesajları, yeni oluşturulan `application.log` dosyasına yazılmaya devam eder.

##### Constructor

`FileTransport` sınıfının constructor'ı aşağıdaki parametreleri alır:

| Parametre              | Açıklama                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `options`              | (Ayrıntılı bilgi için [ITransport](#52-itransport-interface) options açıklamasına bakınız.) |
| `fileTransportOptions` | Dosya saklama yapılandırmalarını içeren parametredir.                                       |

- **`fileTransportOptions`**

  | Parametre     | Açıklama                                                                     | Varsayılan |
  | ------------- | ---------------------------------------------------------------------------- | ---------- |
  | `filePath`    | Logların yazılacağı dosyanın yolu.                                           | N/A        |
  | `maxSizeInMB` | Dosya boyut sınırı (megabayt olarak). Bu sınır aşıldığında dosya döndürülür. | `5`        |

#### 2.3. ApiTranspor Class

`ApiTransport`, log mesajlarını bir API'ye göndermek için kullanılan bir taşıma sınıfıdır. Yeniden deneme (retry) mekanizması içerir ve log mesajlarını API istekleri olarak iletir.

##### Constructor

`ApiTransport` sınıfının constructor'ı aşağıdaki parametreleri alır:

| Parametre             | Açıklama                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `options`             | (Ayrıntılı bilgi için [ITransport](#52-itransport-interface) options açıklamasına bakınız.) |
| `apiTransportOptions` | API istek yapılandırmalarını içeren parametredir.                                           |

- **`apiTransportOptions`:**

  | Özellik      | Açıklama                                                         | Varsayılan |
  | ------------ | ---------------------------------------------------------------- | ---------- |
  | `endpoint`   | Log mesajlarının gönderileceği API adresi.                       | N/A        |
  | `headers`    | İsteğe eklenmesi gereken HTTP başlıkları.                        | N/A        |
  | `method`     | Giden isteğin tipi.                                              | `POST`     |
  | `retries`    | Başarısız olan isteklerin kaç kez tekrar deneneceği.             | `3`        |
  | `retryDelay` | Başarısız istekler arasında kaç milisaniye beklenmesi gerektiği. | `1000`     |

## ⚠️ Uyarılar

- `LoggerConfig.init` static metodunun sadece bir kere ve yeni bir `Logger` referansı oluşturulmadan önce çağrıldığına emin olun.
- Kütüphaneyi kullanırken log dosyalarının boyutunu ve disk kullanımını düzenli olarak kontrol edin.
- API loglaması yaparken, logların hassas bilgileri içermediğinden emin olun.
- Performans gereksinimlerinize göre uygun log seviyelerini ve taşıma mekanizmalarını seçin.
- Log formatlayıcılarını ve taşıma mekanizmalarını özelleştirirken, performans ve güvenlik konularına dikkat edin.
- Log dosyalarının döndürülmesi (rotate) işlemi sırasında veri kaybı yaşanmaması için uygun dosya boyut sınırlarını belirleyin.
- API loglaması yaparken, yeniden deneme (retry) mekanizmasının doğru yapılandırıldığından emin olun.
- Log seviyelerini doğru belirleyerek gereksiz log üretimini önleyin.

## 📜 Lisans

Bu proje [MIT](https://opensource.org/licenses/MIT) lisansı ile lisanslanmıştır. Daha fazla bilgi için [`LICENSE`](./LICENSE) dosyasına bakabilirsiniz.

## 🤝 Katkı Sağlama

Katkıda bulunmak isterseniz, lütfen bir pull request gönderin veya bir issue açın.
