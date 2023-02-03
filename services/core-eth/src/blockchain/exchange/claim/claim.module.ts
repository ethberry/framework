import { Logger, Module } from "@nestjs/common";

import { ExchangeClaimServiceEth } from "./claim.service.eth";
import { ExchangeClaimControllerEth } from "./claim.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { ClaimModule } from "../../mechanics/claim/claim.module";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ExchangeHistoryModule, ClaimModule, AssetModule],
  providers: [Logger, ExchangeClaimServiceEth],
  controllers: [ExchangeClaimControllerEth],
  exports: [ExchangeClaimServiceEth],
})
export class ExchangeClaimModule {}
