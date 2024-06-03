import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../../../hierarchy/contract/contract.entity";
import { RaffleTicketContractService } from "./contract.service";
import { RaffleTicketContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleTicketContractService],
  controllers: [RaffleTicketContractController],
  exports: [RaffleTicketContractService],
})
export class RaffleTicketContractModule {}
