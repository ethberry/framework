import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootContractService } from "./contract.service";
import { LootContractController } from "./contract.controller";
import { LootTokenModule } from "../token/token.module";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity]), LootTokenModule],
  providers: [LootContractService],
  controllers: [LootContractController],
  exports: [LootContractService],
})
export class LootContractModule {}
