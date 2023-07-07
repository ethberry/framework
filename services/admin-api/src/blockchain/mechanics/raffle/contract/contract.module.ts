import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { RaffleContractService } from "./contract.service";
import { RaffleContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleContractService],
  controllers: [RaffleContractController],
  exports: [RaffleContractService],
})
export class RaffleContractModule {}
