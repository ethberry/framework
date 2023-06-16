import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { ReferralModule } from "./referral/referral.module";
import { LotteryModule } from "./lottery/lottery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { WaitlistModule } from "./waitlist/waitlist.module";
import { WrapperModule } from "./wrapper/wrapper.module";
import { BreedModule } from "./breed/breed.module";
import { RentModule } from "./rent/rent.module";
import { RaffleModule } from "./raffle/raffle.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    StakingModule,
    VestingModule,
    ReferralModule,
    LotteryModule,
    RaffleModule,
    PyramidModule,
    WaitlistModule,
    WrapperModule,
    BreedModule,
    RentModule,
  ],
})
export class MechanicsModule {}
