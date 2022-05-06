import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, ethersWsProvider } from "@gemunion/nestjs-ethers";

import { Erc721TokenHistoryModule } from "../token-history/token-history.module";
import { Erc721CollectionModule } from "../collection/collection.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721AirdropModule } from "../airdrop/airdrop.module";
import { Erc721DropboxModule } from "../dropbox/dropbox.module";

import { Erc721TokenControllerWs } from "./token.controller.ws";
import { Erc721TokenServiceWs } from "./token.service.ws";
import { Erc721TokenService } from "./token.service";
import { Erc721TokenEntity } from "./token.entity";

@Module({
  imports: [
    ConfigModule,
    Erc721TokenHistoryModule,
    Erc721TemplateModule,
    Erc721AirdropModule,
    Erc721DropboxModule,
    forwardRef(() => Erc721CollectionModule),
    TypeOrmModule.forFeature([Erc721TokenEntity]),
  ],
  providers: [ethersRpcProvider, ethersWsProvider, Logger, Erc721TokenService, Erc721TokenServiceWs],
  controllers: [Erc721TokenControllerWs],
  exports: [Erc721TokenService, Erc721TokenServiceWs],
})
export class Erc721TokenModule {}
