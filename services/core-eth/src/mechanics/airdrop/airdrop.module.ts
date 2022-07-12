import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AirdropEntity } from "./airdrop.entity";
import { AirdropService } from "./airdrop.service";
import { AirdropLogModule } from "./airdrop-log/airdrop-log.module";
import { AirdropControllerEth } from "./airdrop.controller.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { AirdropServiceEth } from "./airdrop.service.eth";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { ContractHistoryModule } from "../../blockchain/contract-history/contract-history.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";

@Module({
  imports: [
    AirdropLogModule,
    TemplateModule,
    TokenModule,
    BalanceModule,
    ConfigModule,
    ContractManagerModule,
    AccessControlModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([AirdropEntity]),
  ],
  providers: [Logger, AirdropService, AirdropServiceEth],
  controllers: [AirdropControllerEth],
  exports: [AirdropService, AirdropServiceEth],
})
export class AirdropModule {}
