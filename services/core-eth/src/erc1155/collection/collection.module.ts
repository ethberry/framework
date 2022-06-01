import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155CollectionService } from "./collection.service";
import { Erc1155CollectionEntity } from "./collection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155CollectionEntity])],
  providers: [Erc1155CollectionService],
  exports: [Erc1155CollectionService],
})
export class Erc1155CollectionModule {}
