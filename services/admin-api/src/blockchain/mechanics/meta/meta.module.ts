import { Module } from "@nestjs/common";

import { AchievementModule } from "./achievements/achievement.module";
import { AssetPromoModule } from "./promo/promo.module";
import { PaymentSplitterModule } from "./payment-splitter/payment-splitter.module";
import { ReferralModule } from "./referral/referral.module";

@Module({
  imports: [AchievementModule, AssetPromoModule, PaymentSplitterModule, ReferralModule],
})
export class MetaMechanicsModule {}
