import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { PonziDepositModule } from "../deposit/deposit.module";
import { PonziRulesService } from "./rules.service";
import { PonziRulesEntity } from "./rules.entity";
import { PonziRulesControllerEth } from "./rules.controller.eth";
import { PonziRulesServiceEth } from "./rules.service.eth";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    ContractModule,
    PonziDepositModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([PonziRulesEntity]),
  ],
  providers: [Logger, signalServiceProvider, PonziRulesService, PonziRulesServiceEth],
  controllers: [PonziRulesControllerEth],
  exports: [PonziRulesService, PonziRulesServiceEth],
})
export class PonziRulesModule {}
