import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CollectionService } from "./collection.service";
import { Erc998CollectionEntity } from "./collection.entity";
import { Erc998CollectionController } from "./collection.controller";
import { Erc998TokenModule } from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998CollectionEntity]), Erc998TokenModule],
  providers: [Erc998CollectionService],
  controllers: [Erc998CollectionController],
  exports: [Erc998CollectionService],
})
export class Erc998CollectionModule {}
