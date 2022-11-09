import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

export const ethLoggerOutServiceProvider = {
  provide: RmqProviderType.WATCHER_OUT_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueuelogger = configService.get<string>("RMQ_QUEUE_ETHLOGGER", "ethlogger");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueuelogger,
      },
    });
  },
};
