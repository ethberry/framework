import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { CraftModule } from "./craft/craft.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { RaffleModule } from "./raffle/raffle.module";
import { ReferralModule } from "./referral/referral.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitlistModule } from "./waitlist/waitlist.module";
import { WrapperModule } from "./wrapper/wrapper.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    CraftModule,
    DropModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    PyramidModule,
    RaffleModule,
    ReferralModule,
    RentModule,
    StakingModule,
    VestingModule,
    WaitlistModule,
    WrapperModule,
  ],
})
export class MechanicsModule {}
