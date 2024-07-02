import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { MetadataContractService } from "./contract.service";
import { MetadataContractController } from "./contract.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [MetadataContractService],
  controllers: [MetadataContractController],
  exports: [MetadataContractService],
})
export class MetadataContractModule {}
