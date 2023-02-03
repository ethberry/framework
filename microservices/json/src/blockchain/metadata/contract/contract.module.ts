import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { MetadataContractService } from "./contract.service";
import { MetadataContractController } from "./contract.controller";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [MetadataContractService],
  controllers: [MetadataContractController],
  exports: [MetadataContractService],
})
export class MetadataContractModule {}
