import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { MysteryboxBoxEntity } from "./mysterybox.entity";
import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxLogModule } from "./log/log.module";
import { MysteryboxControllerEth } from "./mysterybox.controller.eth";
import { MysteryboxServiceEth } from "./mysterybox.service.eth";
import { AccessControlModule } from "../../access-control/access-control.module";
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
    TemplateModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([MysteryboxBoxEntity]),
  ],
  providers: [Logger, MysteryboxService, MysteryboxServiceEth, ethersRpcProvider],
  controllers: [MysteryboxControllerEth],
  exports: [MysteryboxService, MysteryboxServiceEth],
})
export class MysteryboxModule {}
