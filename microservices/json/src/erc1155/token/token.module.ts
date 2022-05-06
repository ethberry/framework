import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenEntity } from "./token.entity";
import { Erc1155TokenController } from "./token.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Erc1155TokenEntity])],
  providers: [Erc1155TokenService],
  controllers: [Erc1155TokenController],
  exports: [Erc1155TokenService],
})
export class Erc1155TokenModule {}
