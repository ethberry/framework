import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721ContractService } from "./contract.service";
import { Erc721ContractController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc721ContractService],
  controllers: [Erc721ContractController],
  exports: [Erc721ContractService],
})
export class Erc721ContractModule {}
