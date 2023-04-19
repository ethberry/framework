import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { SettingsModule } from "../../infrastructure/settings/settings.module";
import { AchievementItemModule } from "../item/item.module";
import { AchievementLevelModule } from "../level/level.module";
import { AchievementSignService } from "./sign.service";
import { AchievementSignController } from "./sign.controller";

@Module({
  imports: [SettingsModule, SignerModule, AchievementLevelModule, AchievementItemModule],
  providers: [Logger, AchievementSignService],
  controllers: [AchievementSignController],
  exports: [AchievementSignService],
})
export class AchievementsSignModule {}
