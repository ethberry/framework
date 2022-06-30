import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { MetadataContractService } from "./contract.service";
import { MetadataContractController } from "./contract.controller";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UniContractEntity])],
  providers: [MetadataContractService],
  controllers: [MetadataContractController],
  exports: [MetadataContractService],
})
export class MetadataContractModule {}
