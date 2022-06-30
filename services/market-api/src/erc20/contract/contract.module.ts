import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractService } from "./contract.service";
import { Erc20ContractController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Erc20ContractService],
  controllers: [Erc20ContractController],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
