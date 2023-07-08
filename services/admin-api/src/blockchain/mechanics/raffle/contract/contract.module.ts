import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleContractService } from "./contract.service";
import { RaffleContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleContractService],
  controllers: [RaffleContractController],
  exports: [RaffleContractService],
})
export class RaffleContractModule {}
