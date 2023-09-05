import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryContractService } from "./contract.service";
import { MysteryContractController } from "./contract.controller";
import { MysteryTokenModule } from "../token/token.module";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity]), MysteryTokenModule],
  providers: [MysteryContractService],
  controllers: [MysteryContractController],
  exports: [MysteryContractService],
})
export class MysteryContractModule {}
