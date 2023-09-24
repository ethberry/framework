import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "../../../infrastructure/user/user.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ClaimModule } from "../../mechanics/claim/claim.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeClaimServiceEth } from "./claim.service.eth";
import { ExchangeClaimControllerEth } from "./claim.controller.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, ClaimModule, AssetModule, UserModule, NotificatorModule],
  providers: [signalServiceProvider, Logger, ExchangeClaimServiceEth],
  controllers: [ExchangeClaimControllerEth],
  exports: [ExchangeClaimServiceEth],
})
export class ExchangeClaimModule {}
