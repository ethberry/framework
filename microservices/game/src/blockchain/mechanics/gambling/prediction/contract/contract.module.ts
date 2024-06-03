import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { PredictionContractService } from "./contract.service";
import { PredictionContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [PredictionContractService],
  controllers: [PredictionContractController],
  exports: [PredictionContractService],
})
export class PredictionContractModule {}
