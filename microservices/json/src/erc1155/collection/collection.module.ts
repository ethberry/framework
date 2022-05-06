import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc1155CollectionService } from "./collection.service";
import { Erc1155CollectionEntity } from "./collection.entity";
import { Erc1155CollectionController } from "./collection.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Erc1155CollectionEntity])],
  providers: [Erc1155CollectionService],
  controllers: [Erc1155CollectionController],
  exports: [Erc1155CollectionService],
})
export class Erc1155CollectionModule {}
