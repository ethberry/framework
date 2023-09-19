import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListService } from "./waitlist.service";
import { WaitListController } from "./waitlist.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [WaitListService],
  controllers: [WaitListController],
  exports: [WaitListService],
})
export class WaitListContractModule {}
