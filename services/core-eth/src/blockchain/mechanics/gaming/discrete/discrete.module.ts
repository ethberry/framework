import { Module, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteService } from "./discrete.service";
import { DiscreteControllerEth } from "./discrete.controller.eth";
import { DiscreteServiceEth } from "./discrete.service.eth";
import { DiscreteServiceLog } from "./discrete.service.log";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    ContractModule,
    TokenModule,
    EventHistoryModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([DiscreteEntity]),
  ],
  providers: [signalServiceProvider, Logger, DiscreteService, DiscreteServiceLog, DiscreteServiceEth],
  controllers: [DiscreteControllerEth],
  exports: [DiscreteService, DiscreteServiceLog, DiscreteServiceEth],
})
export class DiscreteModule implements OnModuleInit {
  constructor(private readonly discreteServiceLog: DiscreteServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.discreteServiceLog.initRegistry();
  }
}
