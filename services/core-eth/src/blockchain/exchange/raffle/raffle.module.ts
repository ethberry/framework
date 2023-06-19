import { Module } from "@nestjs/common";

import { ExchangeRaffleServiceEth } from "./raffle.service.eth";
import { ExchangeRaffleControllerEth } from "./raffle.controller.eth";
import { TokenModule } from "../../hierarchy/token/token.module";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TemplateModule } from "../../hierarchy/template/template.module";

@Module({
  imports: [EventHistoryModule, AssetModule, TemplateModule, TokenModule],
  providers: [ExchangeRaffleServiceEth],
  controllers: [ExchangeRaffleControllerEth],
  exports: [ExchangeRaffleServiceEth],
})
export class ExchangeRaffleModule {}
