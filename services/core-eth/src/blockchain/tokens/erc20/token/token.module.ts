import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { Erc20TokenServiceLog } from "./token.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    BalanceModule,
    EventHistoryModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [signalServiceProvider, Erc20TokenServiceLog, Erc20TokenServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenServiceLog, Erc20TokenServiceEth],
})
export class Erc20TokenModule implements OnModuleInit {
  constructor(private readonly erc20TokenServiceLog: Erc20TokenServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.erc20TokenServiceLog.updateRegistry();
  }
}
