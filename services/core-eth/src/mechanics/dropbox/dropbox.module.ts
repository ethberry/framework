import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropboxEntity } from "./dropbox.entity";
import { Erc721DropboxService } from "./dropbox.service";
import { Erc721DropboxLogModule } from "./dropbox-log/dropbox-log.module";
import { Erc721DropboxControllerEth } from "./dropbox.controller.eth";
import { Erc721DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { Erc721TokenModule } from "../../erc721/token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc721TemplateModule } from "../../erc721/template/template.module";
import { Erc721TokenHistoryModule } from "../../erc721/token/token-history/token-history.module";
import { Erc721ContractModule } from "../../erc721/contract/contract.module";

@Module({
  imports: [
    ConfigModule,
    Erc721TokenModule,
    Erc721DropboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    Erc721TemplateModule,
    Erc721TokenHistoryModule,
    Erc721ContractModule,
    TypeOrmModule.forFeature([DropboxEntity]),
  ],
  providers: [Logger, Erc721DropboxService, Erc721DropboxServiceEth],
  controllers: [Erc721DropboxControllerEth],
  exports: [Erc721DropboxService, Erc721DropboxServiceEth],
})
export class Erc721DropboxModule {}
