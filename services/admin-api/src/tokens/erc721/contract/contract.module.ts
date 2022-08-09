import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721ContractService } from "./contract.service";
import { Erc721ContractController } from "./contract.controller";
import { ContractEntity } from "../../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Erc721ContractService],
  controllers: [Erc721ContractController],
  exports: [Erc721ContractService],
})
export class Erc721ContractModule {}
