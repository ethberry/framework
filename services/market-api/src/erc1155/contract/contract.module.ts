import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155ContractService } from "./contract.service";
import { Erc1155CollectionController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc1155ContractService],
  controllers: [Erc1155CollectionController],
  exports: [Erc1155ContractService],
})
export class Erc1155CollectionModule {}
