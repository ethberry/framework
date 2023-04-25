import { Logger, Module } from "@nestjs/common";

import { ExchangeClaimServiceEth } from "./claim.service.eth";
import { ExchangeClaimControllerEth } from "./claim.controller.eth";
import { ClaimModule } from "../../mechanics/claim/claim.module";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { UserModule } from "../../../infrastructure/user/user.module";
import { AchievementModule } from "../../../achievements/achievement.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";

@Module({
  imports: [EventHistoryModule, ClaimModule, AssetModule, AchievementModule, UserModule, NotificatorModule],
  providers: [Logger, ExchangeClaimServiceEth],
  controllers: [ExchangeClaimControllerEth],
  exports: [ExchangeClaimServiceEth],
})
export class ExchangeClaimModule {}
