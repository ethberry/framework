import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

import { NotificatorService } from "./notificator.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    ClientsModule.registerAsync([
      {
        name: RmqProviderType.NOTIFICATOR_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>("RMQ_URL", "");
          const rmqQueueGame = configService.get<string>("RMQ_QUEUE_GAME", "");
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: rmqQueueGame,
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
})
export class NotificatorModule {}
