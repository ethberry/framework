import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155CollectionService } from "./contract.service";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Erc1155CollectionService],
  exports: [Erc1155CollectionService],
})
export class Erc1155CollectionModule {}
