import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { PaymentSplitterContractService } from "./contract.service";
import { PaymentSplitterContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [PaymentSplitterContractService],
  controllers: [PaymentSplitterContractController],
  exports: [PaymentSplitterContractService],
})
export class PaymentSplitterContractModule {}
