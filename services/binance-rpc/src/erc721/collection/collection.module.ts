import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721CollectionService } from "./collection.service";
import { Erc721CollectionEntity } from "./collection.entity";
import { Erc721TokenModule } from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721CollectionEntity]), forwardRef(() => Erc721TokenModule)],
  providers: [Erc721CollectionService],
  exports: [Erc721CollectionService],
})
export class Erc721CollectionModule {}
