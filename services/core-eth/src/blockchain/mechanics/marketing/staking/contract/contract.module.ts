import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../../common/providers";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { StakingRulesControllerEth } from "./contract.controller.eth";
import { StakingContractServiceEth } from "./contract.service.eth";
import { StakingPenaltyModule } from "../penalty/penalty.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { StakingDepositModule } from "../deposit/deposit.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { StakingContractServiceCron } from "./contract.service.cron";
import { StakingContractServiceLog } from "./contract.service.log";

@Module({
  imports: [
    ConfigModule,
    EthersModule.deferred(),
    EventHistoryModule,
    TokenModule,
    TemplateModule,
    AssetModule,
    ContractModule,
    StakingDepositModule,
    StakingPenaltyModule,
  ],
  providers: [
    Logger,
    signalServiceProvider,
    StakingContractServiceLog,
    StakingContractServiceEth,
    StakingContractServiceCron,
  ],
  controllers: [StakingRulesControllerEth],
  exports: [StakingContractServiceLog, StakingContractServiceEth, StakingContractServiceCron],
})
export class StakingContractModule {}
