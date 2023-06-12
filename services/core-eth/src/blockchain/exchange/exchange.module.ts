import { Module } from "@nestjs/common";

import { ExchangeCraftModule } from "./craft/craft.module";
import { ExchangeClaimModule } from "./claim/claim.module";
import { ExchangeCoreModule } from "./core/core.module";
import { ExchangeGradeModule } from "./grade/grade.module";
import { ExchangeMysteryModule } from "./mystery/mystery.module";
import { ExchangeBreedModule } from "./breed/breed.module";
import { ExchangeLogModule } from "./log/log.module";
import { ExchangeRentModule } from "./rent/rent.module";
import { ExchangeLotteryModule } from "./lottery/lottery.module";
import { ExchangeRaffleModule } from "./raffle/raffle.module";

@Module({
  imports: [
    ExchangeLogModule,
    ExchangeBreedModule,
    ExchangeClaimModule,
    ExchangeCoreModule,
    ExchangeCraftModule,
    ExchangeGradeModule,
    ExchangeMysteryModule,
    ExchangeRentModule,
    ExchangeLotteryModule,
    ExchangeRaffleModule,
  ],
})
export class ExchangeModule {}
