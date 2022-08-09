import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenService } from "./token.service";
import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [Erc1155TokenService],
  exports: [Erc1155TokenService],
})
export class Erc1155TokenModule {}
