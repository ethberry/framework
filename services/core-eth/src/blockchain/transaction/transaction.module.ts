import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { ContractModule } from "../hierarchy/contract/contract.module";
import { MerchantModule } from "../../infrastructure/merchant/merchant.module";
import { signalServiceProvider } from "../../common/providers";
import { EventHistoryModule } from "../event-history/event-history.module";
import { TransactionEntity } from "./transaction.entity";
import { TransactionService } from "./transaction.service";
import { TransactionServiceCron } from "./transaction.service.cron";
import { TransactionServiceRedis } from "./transaction.service.redis";

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule,
    ContractModule,
    MerchantModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  // controllers: [SchedulerControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    signalServiceProvider,
    TransactionService,
    TransactionServiceCron,
    TransactionServiceRedis,
  ],
  exports: [TransactionService, TransactionServiceCron, TransactionServiceRedis],
})
export class TransactionModule implements OnModuleInit {
  constructor(
    private readonly transactionServiceRedis: TransactionServiceRedis,
    private readonly transactionServiceCron: TransactionServiceCron,
  ) {}

  // run worker
  public async onModuleInit(): Promise<void> {
    this.transactionServiceRedis.processQueue();
    return this.transactionServiceCron.checkTransaction();
  }
}
