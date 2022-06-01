import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc721TemplateModule } from "../template/template.module";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropService } from "./airdrop.service";
import { Erc721AirdropLogModule } from "./airdrop-log/airdrop-log.module";
import { Erc721AirdropControllerEth } from "./airdrop.controller.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { Erc721AirdropServiceEth } from "./airdrop.service.eth";
import { Erc721TokenModule } from "../token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc721TokenHistoryModule } from "../token/token-history/token-history.module";
import { Erc721CollectionModule } from "../collection/collection.module";

@Module({
  imports: [
    Erc721AirdropLogModule,
    Erc721TemplateModule,
    Erc721TokenModule,
    ConfigModule,
    ContractManagerModule,
    AccessControlModule,
    Erc721TemplateModule,
    Erc721TokenHistoryModule,
    Erc721CollectionModule,
    TypeOrmModule.forFeature([Erc721AirdropEntity]),
  ],
  providers: [Logger, Erc721AirdropService, Erc721AirdropServiceEth],
  controllers: [Erc721AirdropControllerEth],
  exports: [Erc721AirdropService, Erc721AirdropServiceEth],
})
export class Erc721AirdropModule {}
