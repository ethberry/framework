import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CollectionService } from "./contract.service";
import { Erc998CollectionController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc998CollectionService],
  controllers: [Erc998CollectionController],
  exports: [Erc998CollectionService],
})
export class Erc998ContractModule {}
