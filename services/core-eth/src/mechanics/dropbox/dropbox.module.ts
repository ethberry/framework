import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropboxEntity } from "./dropbox.entity";
import { DropboxService } from "./dropbox.service";
import { DropboxLogModule } from "./dropbox-log/dropbox-log.module";
import { DropboxControllerEth } from "./dropbox.controller.eth";
import { DropboxServiceEth } from "./dropbox.service.eth";
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
    DropboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    TemplateModule,
    ContractHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([DropboxEntity]),
  ],
  providers: [Logger, DropboxService, DropboxServiceEth],
  controllers: [DropboxControllerEth],
  exports: [DropboxService, DropboxServiceEth],
})
export class DropboxModule {}
