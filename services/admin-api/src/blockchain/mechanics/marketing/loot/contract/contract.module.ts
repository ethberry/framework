import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootContractService } from "./contract.service";
import { LootContractController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [LootContractService],
  controllers: [LootContractController],
  exports: [LootContractService],
})
export class LootContractModule {}
