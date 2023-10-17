import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { RaffleContractService } from "./contract.service";
import { RaffleContractController } from "./contract.controller";
import { cronServiceProvider } from "../../../../common/providers";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [cronServiceProvider, RaffleContractService],
  controllers: [RaffleContractController],
  exports: [RaffleContractService],
})
export class RaffleContractModule {}
