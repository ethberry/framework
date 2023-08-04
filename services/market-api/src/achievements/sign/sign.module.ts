import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../infrastructure/settings/settings.module";
import { AchievementItemModule } from "../item/item.module";
import { AchievementLevelModule } from "../level/level.module";
import { AchievementSignService } from "./sign.service";
import { AchievementSignController } from "./sign.controller";
import { ClaimModule } from "../../blockchain/mechanics/claim/claim.module";
import { AchievementRedemptionModule } from "../redemption/redemption.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";

@Module({
  imports: [
    SettingsModule,
    SignerModule,
    AchievementLevelModule,
    AchievementRedemptionModule,
    AchievementItemModule,
    ClaimModule,
    ContractModule,
  ],
  providers: [Logger, AchievementSignService],
  controllers: [AchievementSignController],
  exports: [AchievementSignService],
})
export class AchievementsSignModule {}
