import { Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Web3LogModule, Web3LogService } from "@gemunion/nestjs-web3";

import { Erc20TokenModule } from "../token/token.module";
import { Erc20VestingModule } from "../vesting/vesting.module";
import { Erc20LogService } from "./log.service";

@Module({
  imports: [Web3LogModule, ConfigModule, Erc20TokenModule, Erc20VestingModule],
  providers: [Logger, Erc20LogService],
  exports: [Erc20LogService],
})
export class Erc20LogModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly erc20LogService: Erc20LogService, private readonly web3LogService: Web3LogService) {}

  public async onModuleInit(): Promise<void> {
    await this.erc20LogService.init();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.web3LogService.destroy();
  }
}
