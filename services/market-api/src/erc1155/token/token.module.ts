import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenController } from "./token.controller";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [Erc1155TokenService],
  controllers: [Erc1155TokenController],
  exports: [Erc1155TokenService],
})
export class Erc1155TokenModule {}
