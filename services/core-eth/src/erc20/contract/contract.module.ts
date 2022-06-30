import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";
import { Erc20ContractService } from "./contract.service";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [Logger, Erc20ContractService],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
