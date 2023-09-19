import { ConfigService } from "@nestjs/config";
import Queue from "bee-queue";

import { RedisQueueProviderType } from "@framework/types";

export const redisQueueProducerServiceProvider = {
  provide: RedisQueueProviderType.PRODUCER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Queue => {
    // producer queues running on the web server
    const sharedConfigSend = {
      getEvents: false,
      isWorker: false,
      redis: {
        url: configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
      },
    };
    // const rmqQueueLogger = configService.get<string>("RMQ_QUEUE_CORE_ETH", "core_eth");
    return new Queue("ETH_EVENTS", sharedConfigSend);
  },
};
