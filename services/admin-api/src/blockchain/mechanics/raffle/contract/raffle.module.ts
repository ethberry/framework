import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleService } from "./raffle.service";
import { RaffleController } from "./raffle.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleService],
  controllers: [RaffleController],
  exports: [RaffleService],
})
export class RaffleContractModule {}
