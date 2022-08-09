import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998ContractService } from "./contract.service";
import { Erc998ContractController } from "./contract.controller";
import { ContractEntity } from "../../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Erc998ContractService],
  controllers: [Erc998ContractController],
  exports: [Erc998ContractService],
})
export class Erc998ContractModule {}
