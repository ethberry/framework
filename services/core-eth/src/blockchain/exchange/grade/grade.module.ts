import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeGradeServiceEth } from "./grade.service.eth";
import { ExchangeGradeControllerEth } from "./grade.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";
import { GradeService } from "../../mechanics/grade/grade.service";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { GradeEntity } from "../../mechanics/grade/grade.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";

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
