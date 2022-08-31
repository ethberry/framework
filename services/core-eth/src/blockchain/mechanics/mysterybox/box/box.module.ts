import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { MysteryboxBoxEntity } from "./box.entity";
import { MysteryboxBoxService } from "./box.service";
import { MysteryboxLogModule } from "./log/log.module";
import { MysteryboxBoxControllerEth } from "./box.controller.eth";
import { MysteryboxBoxServiceEth } from "./box.service.eth";
import { AccessControlModule } from "../../../access-control/access-control.module";
import { ContractHistoryModule } from "../../../contract-history/contract-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";

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
  providers: [Logger, MysteryboxBoxService, MysteryboxBoxServiceEth, ethersRpcProvider],
  controllers: [MysteryboxBoxControllerEth],
  exports: [MysteryboxBoxService, MysteryboxBoxServiceEth],
})
export class MysteryboxBoxModule {}
