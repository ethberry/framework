import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PredictionContractService } from "./contract.service";
import { PredictionContractController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [PredictionContractService],
  controllers: [PredictionContractController],
  exports: [PredictionContractService],
})
export class PredictionContractModule {}
