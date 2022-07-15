import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootboxEntity } from "./lootbox.entity";
import { LootboxService } from "./lootbox.service";
import { LootboxLogModule } from "./lootbox-log/lootbox-log.module";
import { LootboxControllerEth } from "./lootbox.controller.eth";
import { LootboxServiceEth } from "./lootbox.service.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { ContractHistoryModule } from "../../blockchain/contract-history/contract-history.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    BalanceModule,
    LootboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    TemplateModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([LootboxEntity]),
  ],
  providers: [Logger, LootboxService, LootboxServiceEth],
  controllers: [LootboxControllerEth],
  exports: [LootboxService, LootboxServiceEth],
})
export class LootboxModule {}
