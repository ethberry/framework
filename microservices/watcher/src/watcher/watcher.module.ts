import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, watcherOutProvider } from "./providers";
import { WatcherEntity } from "./watcher.entity";
import { WatcherService } from "./watcher.service";
import { WatcherServiceRedis } from "./watcher.service.redis";
import { WatcherControllerHttp } from "./watcher.controller.http";
import { WatcherControllerWs } from "./watcher.controller.ws";
import { WatcherServiceWs } from "./watcher.service.ws";
import { WatcherControllerRmq } from "./watcher.controller.rmq";
import { WatcherServiceRmq } from "./watcher.service.rmq";

@Module({
  imports: [TypeOrmModule.forFeature([WatcherEntity])],
  providers: [watcherOutProvider, ethersRpcProvider, Logger, WatcherService, WatcherServiceRedis],
  controllers: [WatcherControllerHttp, WatcherControllerWs, WatcherControllerRmq],
  exports: [WatcherService, WatcherServiceWs, WatcherServiceRmq, WatcherServiceRedis],
})
export class WatcherModule implements OnModuleInit {
  constructor(private readonly transactionService: WatcherService) {}

  public async onModuleInit(): Promise<void> {
    await this.transactionService.init();
  }
}
