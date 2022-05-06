import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721CollectionService } from "./collection.service";
import { Erc721CollectionEntity } from "./collection.entity";
import { Erc721CollectionController } from "./collection.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721CollectionEntity])],
  providers: [Erc721CollectionService],
  controllers: [Erc721CollectionController],
  exports: [Erc721CollectionService],
})
export class Erc721CollectionModule {}
