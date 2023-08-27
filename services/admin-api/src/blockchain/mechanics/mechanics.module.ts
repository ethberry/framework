import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { CollectionModule } from "./collection/collection.module";
import { CraftModule } from "./craft/craft.module";
import { DismantleModule } from "./dismantle/dismantle.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MergeModule } from "./merge/merge.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    CollectionModule,
    CraftModule,
    DismantleModule,
    DropModule,
    GradeModule,
    LotteryModule,
    MergeModule,
    MysteryModule,
    RaffleModule,
    RentModule,
    StakingModule,
    PonziModule,
    VestingModule,
    WaitListModule,
  ],
})
export class MechanicsModule {}
