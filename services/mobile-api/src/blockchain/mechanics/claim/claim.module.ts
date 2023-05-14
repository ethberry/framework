import { Logger, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RmqProviderType } from "@framework/types";

import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RmqProviderType.GAME_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
          const rmqQueueGame = configService.get<string>("RMQ_QUEUE_GAME", "game");
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: rmqQueueGame,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [Logger, ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
