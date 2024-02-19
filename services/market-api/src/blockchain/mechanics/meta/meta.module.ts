import { Module } from "@nestjs/common";

import { AchievementModule } from "./achievements/achievement.module";
import { AssetPromoModule } from "./promo/promo.module";
import { ReferralModule } from "./referral/referral.module";

@Module({
  imports: [AchievementModule, AssetPromoModule, ReferralModule],
})
export class MetaMechanicsModule {}
