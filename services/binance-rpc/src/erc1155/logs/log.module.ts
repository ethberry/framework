import { Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Web3LogModule, Web3LogService } from "@gemunion/nestjs-web3";

import { Erc1155CollectionModule } from "../collection/collection.module";
import { Erc1155LogService } from "./log.service";

@Module({
  imports: [Web3LogModule, ConfigModule, Erc1155CollectionModule],
  providers: [Logger, Erc1155LogService],
  exports: [Erc1155LogService],
})
export class Erc1155LogModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly erc1155LogService: Erc1155LogService, private readonly web3LogService: Web3LogService) {}

  public async onModuleInit(): Promise<void> {
    await this.erc1155LogService.init();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.web3LogService.destroy();
  }
}
