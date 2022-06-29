import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155CollectionService } from "./contract.service";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc1155CollectionService],
  exports: [Erc1155CollectionService],
})
export class Erc1155CollectionModule {}
