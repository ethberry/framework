import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721DropboxEntity } from "./dropbox.entity";
import { Erc721DropboxService } from "./dropbox.service";
import { Erc721DropboxLogModule } from "./dropbox-log/dropbox-log.module";
import { Erc721DropboxControllerEth } from "./dropbox.controller.eth";
import { Erc721DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { Erc721TokenModule } from "../token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721TokenHistoryModule } from "../token/token-history/token-history.module";
import { Erc721CollectionModule } from "../collection/collection.module";

@Module({
  imports: [
    ConfigModule,
    Erc721TokenModule,
    Erc721DropboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    Erc721TemplateModule,
    Erc721TokenHistoryModule,
    Erc721CollectionModule,
    TypeOrmModule.forFeature([Erc721DropboxEntity]),
  ],
  providers: [Logger, Erc721DropboxService, Erc721DropboxServiceEth],
  controllers: [Erc721DropboxControllerEth],
  exports: [Erc721DropboxService, Erc721DropboxServiceEth],
})
export class Erc721DropboxModule {}
