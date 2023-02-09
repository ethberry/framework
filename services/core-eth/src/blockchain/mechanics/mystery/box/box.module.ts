import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryLogModule } from "./log/log.module";
import { MysteryBoxControllerEth } from "./box.controller.eth";
import { MysteryBoxServiceEth } from "./box.service.eth";
import { ContractHistoryModule } from "../../../hierarchy/contract/history/history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    BalanceModule,
    MysteryLogModule,
    TemplateModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([MysteryBoxEntity]),
  ],
  providers: [Logger, MysteryBoxService, MysteryBoxServiceEth, ethersRpcProvider],
  controllers: [MysteryBoxControllerEth],
  exports: [MysteryBoxService, MysteryBoxServiceEth],
})
export class MysteryBoxModule {}
