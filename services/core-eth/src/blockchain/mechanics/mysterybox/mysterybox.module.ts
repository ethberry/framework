import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxLogModule } from "./mysterybox-log/mysterybox-log.module";
import { MysteryboxControllerEth } from "./mysterybox.controller.eth";
import { MysteryboxServiceEth } from "./mysterybox.service.eth";
import { AccessControlModule } from "../../access-control/access-control.module";
import { ContractManagerModule } from "../../contract-manager/contract-manager.module";
import { ContractHistoryModule } from "../../contract-history/contract-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    BalanceModule,
    MysteryboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    TemplateModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([MysteryboxEntity]),
  ],
  providers: [Logger, MysteryboxService, MysteryboxServiceEth, ethersRpcProvider],
  controllers: [MysteryboxControllerEth],
  exports: [MysteryboxService, MysteryboxServiceEth],
})
export class MysteryboxModule {}
