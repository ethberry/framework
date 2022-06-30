import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenService } from "./token.service";
import { Erc721TokenController } from "./token.controller";
import { Erc721TokenHistoryModule } from "./token-history/token-history.module";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";

@Module({
  imports: [Erc721TokenHistoryModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [Erc721TokenService],
  controllers: [Erc721TokenController],
  exports: [Erc721TokenService],
})
export class Erc721TokenModule {}
