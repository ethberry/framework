import { Logger, Module } from "@nestjs/common";

import { UserModule } from "../../../infrastructure/user/user.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ClaimModule } from "../../mechanics/claim/claim.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeClaimServiceEth } from "./claim.service.eth";
import { ExchangeClaimControllerEth } from "./claim.controller.eth";

@Module({
  imports: [EventHistoryModule, ClaimModule, AssetModule, UserModule, NotificatorModule],
  providers: [Logger, ExchangeClaimServiceEth],
  controllers: [ExchangeClaimControllerEth],
  exports: [ExchangeClaimServiceEth],
})
export class ExchangeClaimModule {}
