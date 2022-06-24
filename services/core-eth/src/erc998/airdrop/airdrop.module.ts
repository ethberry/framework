import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc998TemplateModule } from "../template/template.module";
import { Erc998AirdropEntity } from "./airdrop.entity";
import { Erc998AirdropService } from "./airdrop.service";
import { Erc998AirdropLogModule } from "./airdrop-log/airdrop-log.module";
import { Erc998AirdropControllerEth } from "./airdrop.controller.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { Erc998AirdropServiceEth } from "./airdrop.service.eth";
import { Erc998TokenModule } from "../token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc998TokenHistoryModule } from "../token/token-history/token-history.module";
import { Erc998CollectionModule } from "../collection/collection.module";

@Module({
  imports: [
    Erc998AirdropLogModule,
    Erc998TemplateModule,
    Erc998TokenModule,
    ConfigModule,
    ContractManagerModule,
    AccessControlModule,
    Erc998TemplateModule,
    Erc998TokenHistoryModule,
    Erc998CollectionModule,
    TypeOrmModule.forFeature([Erc998AirdropEntity]),
  ],
  providers: [Logger, Erc998AirdropService, Erc998AirdropServiceEth],
  controllers: [Erc998AirdropControllerEth],
  exports: [Erc998AirdropService, Erc998AirdropServiceEth],
})
export class Erc998AirdropModule {}
