import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [Logger, ContractService],
  exports: [ContractService],
})
export class ContractModule {}
