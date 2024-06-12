import { Module } from "@nestjs/common";

import { ExchangeBreedModule } from "./breed/breed.module";
import { ExchangeCoreModule } from "./core/core.module";
import { ExchangeClaimModule } from "./claim/claim.module";
import { ExchangeCraftModule } from "./craft/craft.module";
import { ExchangeDismantleModule } from "./dismantle/dismantle.module";
import { ExchangeGradeModule } from "./discrete/discrete.module";
import { ExchangeLogModule } from "./log/log.module";
import { ExchangeLootModule } from "./loot/loot.module";
import { ExchangeLotteryModule } from "./lottery/lottery.module";
import { ExchangeMergeModule } from "./merge/merge.module";
import { ExchangeMysteryModule } from "./mystery/mystery.module";
import { ExchangeRaffleModule } from "./raffle/raffle.module";
import { ExchangeRentModule } from "./rent/rent.module";

@Module({
  imports: [
    ExchangeBreedModule,
    ExchangeClaimModule,
    ExchangeCoreModule,
    ExchangeCraftModule,
    ExchangeDismantleModule,
    ExchangeGradeModule,
    ExchangeLogModule,
    ExchangeLootModule,
    ExchangeLotteryModule,
    ExchangeMergeModule,
    ExchangeMysteryModule,
    ExchangeRaffleModule,
    ExchangeRentModule,
  ],
})
export class ExchangeModule {}
