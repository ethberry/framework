import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998ContractService } from "./contract.service";
import { Erc998ContractController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc998ContractService],
  controllers: [Erc998ContractController],
  exports: [Erc998ContractService],
})
export class Erc998ContractModule {}
