import { ConfigService } from "@nestjs/config";
import Queue from "bee-queue";

export enum RedisProviderType {
  QUEUE_IN_SERVICE = "QUEUE_IN_SERVICE",
  QUEUE_OUT_SERVICE = "QUEUE_OUT_SERVICE",
}

export const ethTxInServiceProvider = {
  provide: RedisProviderType.QUEUE_IN_SERVICE,
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
    return new Queue("ETH_EVENTS", sharedConfigSend);
  },
};
