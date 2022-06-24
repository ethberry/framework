import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998DropboxEntity } from "./dropbox.entity";
import { Erc998DropboxService } from "./dropbox.service";
import { Erc998DropboxLogModule } from "./dropbox-log/dropbox-log.module";
import { Erc998DropboxControllerEth } from "./dropbox.controller.eth";
import { Erc998DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { Erc998TokenModule } from "../token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc998TemplateModule } from "../template/template.module";
import { Erc998TokenHistoryModule } from "../token/token-history/token-history.module";
import { Erc998CollectionModule } from "../collection/collection.module";

@Module({
  imports: [
    ConfigModule,
    Erc998TokenModule,
    Erc998DropboxLogModule,
    AccessControlModule,
    ContractManagerModule,
    Erc998TemplateModule,
    Erc998TokenHistoryModule,
    Erc998CollectionModule,
    TypeOrmModule.forFeature([Erc998DropboxEntity]),
  ],
  providers: [Logger, Erc998DropboxService, Erc998DropboxServiceEth],
  controllers: [Erc998DropboxControllerEth],
  exports: [Erc998DropboxService, Erc998DropboxServiceEth],
})
export class Erc998DropboxModule {}
