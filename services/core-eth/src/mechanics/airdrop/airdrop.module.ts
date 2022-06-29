import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc721TemplateModule } from "../../erc721/template/template.module";
import { AirdropEntity } from "./airdrop.entity";
import { AirdropService } from "./airdrop.service";
import { AirdropLogModule } from "./airdrop-log/airdrop-log.module";
import { AirdropControllerEth } from "./airdrop.controller.eth";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { AirdropServiceEth } from "./airdrop.service.eth";
import { Erc721TokenModule } from "../../erc721/token/token.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc721TokenHistoryModule } from "../../erc721/token/token-history/token-history.module";
import { Erc721ContractModule } from "../../erc721/contract/contract.module";

@Module({
  imports: [
    AirdropLogModule,
    Erc721TemplateModule,
    Erc721TokenModule,
    ConfigModule,
    ContractManagerModule,
    AccessControlModule,
    Erc721TemplateModule,
    Erc721TokenHistoryModule,
    Erc721ContractModule,
    TypeOrmModule.forFeature([AirdropEntity]),
  ],
  providers: [Logger, AirdropService, AirdropServiceEth],
  controllers: [AirdropControllerEth],
  exports: [AirdropService, AirdropServiceEth],
})
export class AirdropModule {}
