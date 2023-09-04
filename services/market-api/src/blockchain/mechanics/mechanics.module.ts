import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";
import { ReferralModule } from "./referral/referral.module";
import { RecipesModule } from "./recipes/recipes.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/waitlist.module";
import { WrapperModule } from "./wrapper/wrapper.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    DropModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    PonziModule,
    RaffleModule,
    RecipesModule,
    ReferralModule,
    RentModule,
    StakingModule,
    VestingModule,
    WaitListModule,
    WrapperModule,
  ],
})
export class MechanicsModule {}
