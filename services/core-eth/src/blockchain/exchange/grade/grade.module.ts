import { Module } from "@nestjs/common";

import { ExchangeGradeServiceEth } from "./grade.service.eth";
import { ExchangeGradeControllerEth } from "./grade.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { AssetModule } from "../asset/asset.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { OpenSeaModule } from "../../../integrations/opensea/opensea.module";

@Module({
  imports: [ExchangeHistoryModule, TokenModule, AssetModule, OpenSeaModule],
  providers: [ExchangeGradeServiceEth],
  controllers: [ExchangeGradeControllerEth],
  exports: [ExchangeGradeServiceEth],
})
export class ExchangeGradeModule {}
