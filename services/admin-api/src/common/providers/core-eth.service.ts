import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

export const coreEthServiceProviderBesu = {
  provide: RmqProviderType.CORE_ETH_SERVICE_GEMUNION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueLogger = configService.get<string>("RMQ_QUEUE_CORE_ETH", "core_eth_gemunion");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueLogger,
      },
    });
  },
};

export const coreEthServiceProviderBinance = {
  provide: RmqProviderType.CORE_ETH_SERVICE_BINANCE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueLoggerBinance = configService.get<string>("RMQ_QUEUE_CORE_ETH_BINANCE", "core_eth_binance");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueLoggerBinance,
      },
    });
  },
};

export const coreEthServiceProviderBinanceTest = {
  provide: RmqProviderType.CORE_ETH_SERVICE_BINANCE_TEST,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueLoggerBinanceTest = configService.get<string>(
      "RMQ_QUEUE_CORE_ETH_BINANCE_TEST",
      "core_eth_binance_test",
    );
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueLoggerBinanceTest,
      },
    });
  },
};
