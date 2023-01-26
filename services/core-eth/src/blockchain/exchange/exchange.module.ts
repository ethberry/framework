import { Logger, Module } from "@nestjs/common";

import { ExchangeServiceEth } from "./exchange.service.eth";
import { ExchangeControllerEth } from "./exchange.controller.eth";
import { ExchangeLogModule } from "./log/log.module";
import { ExchangeHistoryModule } from "./history/history.module";
import { ClaimModule } from "../mechanics/claim/claim.module";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { AssetModule } from "./asset/asset.module";
import { TokenModule } from "../hierarchy/token/token.module";
import { TemplateModule } from "../hierarchy/template/template.module";
import { GradeModule } from "../mechanics/grade/grade.module";
import { BreedModule } from "../mechanics/breed/breed.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";

@Module({
  imports: [
    ContractModule,
    ExchangeHistoryModule,
    ExchangeLogModule,
    ClaimModule,
    GradeModule,
    TemplateModule,
    TokenModule,
    AssetModule,
    BreedModule,
    OpenSeaModule,
  ],
  providers: [Logger, ExchangeServiceEth],
  controllers: [ExchangeControllerEth],
  exports: [ExchangeServiceEth],
})
export class ExchangeModule {}
