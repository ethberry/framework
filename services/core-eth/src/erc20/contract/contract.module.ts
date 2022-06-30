import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { Erc20ContractService } from "./contract.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Logger, Erc20ContractService],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
