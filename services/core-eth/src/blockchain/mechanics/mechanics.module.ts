import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryboxModule } from "./mysterybox/mysterybox.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { ReferralModule } from "./referral/referral.module";
import { LotteryModule } from "./lottery/lottery.module";

@Module({
  imports: [ClaimModule, MysteryboxModule, ExchangeModule, StakingModule, VestingModule, ReferralModule, LotteryModule],
})
export class MechanicsModule {}
