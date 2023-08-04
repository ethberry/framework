import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryContractService } from "./contract.service";
import { MysteryContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [MysteryContractService],
  controllers: [MysteryContractController],
  exports: [MysteryContractService],
})
export class MysteryContractModule {}
