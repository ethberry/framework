import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";

import {ProviderType} from "@trejgun/solo-types";

export const warehouseServiceProvider = {
  provide: ProviderType.WAREHOUSE_SERVICE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    const rmqQueueWarehouse = configService.get<string>("RMQ_QUEUE_WAREHOUSE", "warehouse");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueWarehouse,
      },
    });
  },
};
