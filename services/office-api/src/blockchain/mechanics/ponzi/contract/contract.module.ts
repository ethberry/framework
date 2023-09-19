import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PonziContractService } from "./contract.service";
import { PonziContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [PonziContractService],
  controllers: [PonziContractController],
  exports: [PonziContractService],
})
export class PonziContractModule {}
