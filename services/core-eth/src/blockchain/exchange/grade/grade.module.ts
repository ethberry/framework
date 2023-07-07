import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { GradeService } from "../../mechanics/grade/grade.service";
import { GradeEntity } from "../../mechanics/grade/grade.entity";
import { AssetModule } from "../asset/asset.module";
import { ExchangeGradeControllerEth } from "./grade.controller.eth";
import { ExchangeGradeServiceEth } from "./grade.service.eth";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    TokenModule,
    AssetModule,
    OpenSeaModule,
    NotificatorModule,
    TypeOrmModule.forFeature([GradeEntity]),
  ],
  providers: [Logger, ExchangeGradeServiceEth, GradeService],
  controllers: [ExchangeGradeControllerEth],
  exports: [ExchangeGradeServiceEth, GradeService],
})
export class ExchangeGradeModule {}
