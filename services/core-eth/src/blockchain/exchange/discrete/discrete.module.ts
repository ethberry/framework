import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { OpenSeaModule } from "../../integrations/opensea/opensea.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { DiscreteService } from "../../mechanics/gaming/discrete/discrete.service";
import { DiscreteEntity } from "../../mechanics/gaming/discrete/discrete.entity";
import { AssetModule } from "../asset/asset.module";
import { ExchangeGradeControllerEth } from "./discrete.controller.eth";
import { ExchangeGradeServiceEth } from "./discrete.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    TokenModule,
    AssetModule,
    OpenSeaModule,
    NotificatorModule,
    TypeOrmModule.forFeature([DiscreteEntity]),
  ],
  providers: [signalServiceProvider, Logger, ExchangeGradeServiceEth, DiscreteService],
  controllers: [ExchangeGradeControllerEth],
  exports: [ExchangeGradeServiceEth, DiscreteService],
})
export class ExchangeGradeModule {}
