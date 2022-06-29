import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721CollectionService } from "./contract.service";
import { Erc721CollectionController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc721CollectionService],
  controllers: [Erc721CollectionController],
  exports: [Erc721CollectionService],
})
export class Erc721ContractModule {}
