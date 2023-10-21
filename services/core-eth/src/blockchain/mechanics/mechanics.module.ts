import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PaymentSplitterModule } from "./payment-splitter/payment-splitter.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";
import { RecipesModule } from "./recipes/recipes.module";
import { ReferralModule } from "./referral/referral.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitListModule } from "./wait-list/wait-list.module";
import { WrapperModule } from "./wrapper/wrapper.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    PaymentSplitterModule,
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
