import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "./contract.entity";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [ContractService],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule {}
