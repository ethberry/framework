import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { Erc721ContractService } from "./contract.service";
import { Erc721ContractController } from "./contract.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [Erc721ContractService],
  controllers: [Erc721ContractController],
  exports: [Erc721ContractService],
})
export class Erc721ContractModule {}
