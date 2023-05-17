import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

import { NotificatorService } from "./notificator.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RmqProviderType.MOBILE_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
          const rmqQueueMobile = configService.get<string>("RMQ_QUEUE_MOBILE", "mobile");
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: rmqQueueMobile,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [NotificatorService],
  exports: [NotificatorService],
})
export class NotificatorModule {}
