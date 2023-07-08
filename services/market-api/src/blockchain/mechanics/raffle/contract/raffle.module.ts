import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { RaffleContractService } from "./raffle.service";
import { RaffleContractController } from "./raffle.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [RaffleContractService],
  controllers: [RaffleContractController],
  exports: [RaffleContractService],
})
export class RaffleContractModule {}
