import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { CollectionModule } from "./collection/collection.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";
import { RecipesModule } from "./recipes/recipes.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    CollectionModule,
    DropModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    RaffleModule,
    RecipesModule,
    RentModule,
    StakingModule,
    PonziModule,
    VestingModule,
    WaitListModule,
  ],
})
export class MechanicsModule {}
