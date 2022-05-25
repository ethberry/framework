import { Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Web3LogModule, Web3LogService } from "@gemunion/nestjs-web3";

import { Erc20TokenModule } from "../token/token.module";
import { Erc20VestingModule } from "../vesting/vesting.module";
import { Erc20VestingLogService } from "./vesting-log.service";

@Module({
  imports: [Web3LogModule, ConfigModule, Erc20TokenModule, Erc20VestingModule],
  providers: [Logger, Erc20VestingLogService],
  exports: [Erc20VestingLogService],
})
export class Erc20VestingLogModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly erc20VestingLogService: Erc20VestingLogService,
    private readonly web3LogService: Web3LogService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.erc20VestingLogService.init();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.web3LogService.destroy();
  }
}
