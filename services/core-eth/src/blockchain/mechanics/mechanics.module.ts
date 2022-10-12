import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { ReferralModule } from "./referral/referral.module";
import { LotteryModule } from "./lottery/lottery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { WaitlistModule } from "./waitlist/waitlist.module";
import { WrapperModule } from "./wrapper/wrapper.module";
import { BreedModule } from "./breed/breed.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    ExchangeModule,
    StakingModule,
    VestingModule,
    ReferralModule,
    LotteryModule,
    PyramidModule,
    WaitlistModule,
    WrapperModule,
    BreedModule,
  ],
})
export class MechanicsModule {}
