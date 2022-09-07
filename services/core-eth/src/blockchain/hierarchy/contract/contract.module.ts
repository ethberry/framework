import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [Logger, ContractService],
  exports: [ContractService],
})
export class ContractModule {}
