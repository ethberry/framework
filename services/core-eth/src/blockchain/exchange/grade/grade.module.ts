import { Logger, Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { GradeModule } from "../../mechanics/grade/grade.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeGradeControllerEth } from "./grade.controller.eth";
import { ExchangeGradeServiceEth } from "./grade.service.eth";

@Module({
  imports: [EventHistoryModule, TokenModule, AssetModule, OpenSeaModule, GradeModule, NotificatorModule],
  providers: [Logger, ExchangeGradeServiceEth],
  controllers: [ExchangeGradeControllerEth],
  exports: [ExchangeGradeServiceEth],
})
export class ExchangeGradeModule {}
