import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeHistoryEntity } from "./history.entity";
import { ExchangeHistoryService } from "./history.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, TypeOrmModule.forFeature([ExchangeHistoryEntity])],
  providers: [Logger, ExchangeHistoryService],
  exports: [ExchangeHistoryService],
})
export class ExchangeHistoryModule {}
