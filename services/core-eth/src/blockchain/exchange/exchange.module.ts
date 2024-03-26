import { Module } from "@nestjs/common";

import { ExchangeBreedModule } from "./breed/breed.module";
import { ExchangeCraftModule } from "./craft/craft.module";
import { ExchangeClaimModule } from "./claim/claim.module";
import { ExchangeCoreModule } from "./core/core.module";
import { ExchangeDismantleModule } from "./dismantle/dismantle.module";
import { ExchangeGradeModule } from "./discrete/discrete.module";
import { ExchangeLogModule } from "./log/log.module";
import { ExchangeLotteryModule } from "./lottery/lottery.module";
import { ExchangeMysteryModule } from "./mystery/mystery.module";
import { ExchangeRentModule } from "./rent/rent.module";
import { ExchangeRaffleModule } from "./raffle/raffle.module";
import { ExchangeMergeModule } from "./merge/merge.module";

@Module({
  imports: [
    ExchangeLogModule,
    ExchangeBreedModule,
    ExchangeClaimModule,
    ExchangeCoreModule,
    ExchangeCraftModule,
    ExchangeDismantleModule,
    ExchangeGradeModule,
    ExchangeMysteryModule,
    ExchangeRentModule,
    ExchangeLotteryModule,
    ExchangeRaffleModule,
    ExchangeMergeModule,
  ],
})
export class ExchangeModule {}
