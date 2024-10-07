import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { signalServiceProvider } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteService } from "./discrete.service";
import { DiscreteControllerEth } from "./discrete.controller.eth";
import { DiscreteServiceEth } from "./discrete.service.eth";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    ContractModule,
    TokenModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([DiscreteEntity]),
  ],
  providers: [signalServiceProvider, Logger, DiscreteService, DiscreteServiceEth],
  controllers: [DiscreteControllerEth],
  exports: [DiscreteService, DiscreteServiceEth],
})
export class DiscreteModule {}
