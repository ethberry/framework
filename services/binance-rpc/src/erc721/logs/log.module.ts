import { Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Web3LogModule, Web3LogService } from "@gemunion/nestjs-web3";

import { Erc721CollectionModule } from "../collection/collection.module";
import { Erc721LogService } from "./log.service";

@Module({
  imports: [Web3LogModule, ConfigModule, Erc721CollectionModule],
  providers: [Logger, Erc721LogService],
  exports: [Erc721LogService],
})
export class Erc721LogModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly erc721LogService: Erc721LogService, private readonly web3LogService: Web3LogService) {}

  public async onModuleInit(): Promise<void> {
    await this.erc721LogService.init();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.web3LogService.destroy();
  }
}
