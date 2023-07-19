import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { CollectionModule } from "./collection/collection.module";
import { CraftModule } from "./craft/craft.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
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
    DropModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    RaffleModule,
    RentModule,
    StakingModule,
    PyramidModule,
    VestingModule,
    WaitListModule,
  ],
})
export class MechanicsModule {}
