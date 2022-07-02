import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropboxEntity } from "./dropbox.entity";
import { DropboxService } from "./dropbox.service";
import { Erc721DropboxLogModule } from "./dropbox-log/dropbox-log.module";
import { Erc721DropboxControllerEth } from "./dropbox.controller.eth";
import { Erc721DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc721TokenHistoryModule } from "../../erc721/token/token-history/token-history.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    Erc721DropboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    TemplateModule,
    Erc721TokenHistoryModule,
    ContractModule,
    TypeOrmModule.forFeature([DropboxEntity]),
  ],
  providers: [Logger, DropboxService, Erc721DropboxServiceEth],
  controllers: [Erc721DropboxControllerEth],
  exports: [DropboxService, Erc721DropboxServiceEth],
})
export class DropboxModule {}
