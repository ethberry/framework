import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidContractService } from "./contract.service";
import { PyramidContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [PyramidContractService],
  controllers: [PyramidContractController],
  exports: [PyramidContractService],
})
export class PyramidContractModule {}
