import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

export const coreEthServiceProviderBesu = {
  provide: RmqProviderType.CORE_ETH_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueLogger = configService.get<string>("RMQ_QUEUE_CORE_ETH", "core_eth");
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
