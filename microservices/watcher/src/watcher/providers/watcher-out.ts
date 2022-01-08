import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@gemunion/framework-types";

export const watcherOutProvider = {
  provide: RmqProviderType.WATCHER_OUT_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueBackend = configService.get<string>("RMQ_QUEUE_WATCHER_OUT", "watcher_out");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueBackend,
      },
    });
  },
};
