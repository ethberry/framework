import { Logger, Module } from "@nestjs/common";

import { ExchangeClaimServiceEth } from "./claim.service.eth";
import { ExchangeClaimControllerEth } from "./claim.controller.eth";
import { ClaimModule } from "../../mechanics/claim/claim.module";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, ClaimModule, AssetModule],
  providers: [Logger, ExchangeClaimServiceEth],
  controllers: [ExchangeClaimControllerEth],
  exports: [ExchangeClaimServiceEth],
})
export class ExchangeClaimModule {}
