import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc998TokenService } from "./token.service";
import { Erc998TokenEntity } from "./token.entity";
import { Erc998TokenController } from "./token.controller";
import { Erc998CollectionModule } from "../collection/collection.module";

@Module({
  imports: [ConfigModule, Erc998CollectionModule, TypeOrmModule.forFeature([Erc998TokenEntity])],
  providers: [Erc998TokenService],
  controllers: [Erc998TokenController],
  exports: [Erc998TokenService],
})
export class Erc998TokenModule {}
