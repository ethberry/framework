import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../hierarchy/contract/contract.module";
import { ExchangeBreedModule } from "./breed/breed.module";
import { ExchangeCoreModule } from "./core/core.module";
import { ExchangeClaimModule } from "./claim/claim.module";
import { ExchangeCraftModule } from "./craft/craft.module";
import { ExchangeDismantleModule } from "./dismantle/dismantle.module";
import { ExchangeGradeModule } from "./discrete/discrete.module";
import { ExchangeLootModule } from "./loot/loot.module";
import { ExchangeLotteryModule } from "./lottery/lottery.module";
import { ExchangeMergeModule } from "./merge/merge.module";
import { ExchangeMysteryModule } from "./mystery/mystery.module";
import { ExchangeRaffleModule } from "./raffle/raffle.module";
import { ExchangeRentModule } from "./rent/rent.module";
import { ExchangeServiceLog } from "./exchange.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EthersModule.deferred(),
    ExchangeBreedModule,
    ExchangeClaimModule,
    ExchangeCoreModule,
    ExchangeCraftModule,
    ExchangeDismantleModule,
    ExchangeGradeModule,
    ExchangeLootModule,
    ExchangeLotteryModule,
    ExchangeMergeModule,
    ExchangeMysteryModule,
    ExchangeRaffleModule,
    ExchangeRentModule,
  ],
  providers: [ExchangeServiceLog],
  controllers: [],
  exports: [ExchangeServiceLog],
})
export class ExchangeModule implements OnModuleInit {
  constructor(protected readonly exchangeServiceLog: ExchangeServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.exchangeServiceLog.updateRegistry();
  }
}
