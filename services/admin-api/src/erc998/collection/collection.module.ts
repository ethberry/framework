import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CollectionService } from "./collection.service";
import { Erc998CollectionEntity } from "./collection.entity";
import { Erc998CollectionController } from "./collection.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998CollectionEntity])],
  providers: [Erc998CollectionService],
  controllers: [Erc998CollectionController],
  exports: [Erc998CollectionService],
})
export class Erc998CollectionModule {}
