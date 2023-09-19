import { Logger, Module } from "@nestjs/common";

import { SettingsModule } from "../../infrastructure/settings/settings.module";
import { AchievementItemModule } from "../item/item.module";
import { AchievementLevelModule } from "../level/level.module";
import { AchievementSignService } from "./sign.service";
import { AchievementSignController } from "./sign.controller";
import { ClaimModule } from "../../blockchain/mechanics/claim/claim.module";
import { AchievementRedemptionModule } from "../redemption/redemption.module";

@Module({
  imports: [SettingsModule, AchievementLevelModule, AchievementRedemptionModule, AchievementItemModule, ClaimModule],
  providers: [Logger, AchievementSignService],
  controllers: [AchievementSignController],
  exports: [AchievementSignService],
})
export class AchievementsSignModule {}
