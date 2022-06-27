import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155CollectionService } from "./collection.service";
import { UniContractEntity } from "./collection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc1155CollectionService],
  exports: [Erc1155CollectionService],
})
export class Erc1155CollectionModule {}
