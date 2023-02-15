import { Module } from "@nestjs/common";

import { ExchangeGradeServiceEth } from "./grade.service.eth";
import { ExchangeGradeControllerEth } from "./grade.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";

@Module({
  imports: [EventHistoryModule, TokenModule, AssetModule, OpenSeaModule],
  providers: [ExchangeGradeServiceEth],
  controllers: [ExchangeGradeControllerEth],
  exports: [ExchangeGradeServiceEth],
})
export class ExchangeGradeModule {}
