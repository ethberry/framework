import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryboxContractService } from "./contract.service";
import { MysteryboxContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [MysteryboxContractService],
  controllers: [MysteryboxContractController],
  exports: [MysteryboxContractService],
})
export class MysteryboxContractModule {}
