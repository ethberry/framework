import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155ContractService } from "./contract.service";
import { Erc1155ContractController } from "./contract.controller";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Erc1155ContractService],
  controllers: [Erc1155ContractController],
  exports: [Erc1155ContractService],
})
export class Erc1155CollectionModule {}
