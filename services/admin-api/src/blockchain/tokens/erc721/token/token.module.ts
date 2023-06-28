import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { Erc721TokenService } from "./token.service";
import { Erc721TokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [Erc721TokenService],
  controllers: [Erc721TokenController],
  exports: [Erc721TokenService],
})
export class Erc721TokenModule {}
