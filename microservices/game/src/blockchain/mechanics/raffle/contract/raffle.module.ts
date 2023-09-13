import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { RaffleContractService } from "./raffle.service";
import { RaffleContractController } from "./raffle.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleContractService],
  controllers: [RaffleContractController],
  exports: [RaffleContractService],
})
export class RaffleContractModule {}
