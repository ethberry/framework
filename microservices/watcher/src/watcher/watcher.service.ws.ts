import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { Block } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

import { EthProviderType, RmqProviderType } from "@gemunion/framework-types";

import { IEthContext, TransactionStatus } from "./interfaces";
import { WatcherOutType } from "../common/constants";
import { WatcherServiceRedis } from "./watcher.service.redis";
import { WatcherService } from "./watcher.service";

@Injectable()
export class WatcherServiceWs {
  private readonly blocksToConfirm: number = 0;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.WATCHER_OUT_SERVICE)
    private readonly watcherOutClientProxy: ClientProxy,
    @Inject(EthProviderType.ETHERS_RPC)
    private readonly jsonRpcProvider: ethers.providers.JsonRpcProvider,
    private readonly transactionService: WatcherService,
    private readonly transactionServiceRedis: WatcherServiceRedis,
    private readonly configService: ConfigService,
  ) {
    this.blocksToConfirm = ~~this.configService.get<string>("BLOCKS_TO_CONFIRM", "32");
  }

  public async block(block: Block, context: IEthContext): Promise<void> {
    this.loggerService.log(JSON.stringify(block, null, "\t"));

    await Promise.all(
      block.transactions.map(async transactionHash => {
        const [, [record]] = await this.transactionServiceRedis.getRecord(`${context.chainId}:${transactionHash}`);
        if (record) {
          await this.transactionService.update(
            { transactionHash },
            {
              blockNumber: block.number,
              status: TransactionStatus.MINED,
            },
          );
          this.watcherOutClientProxy.emit(WatcherOutType.TRANSACTION_MINED, {
            transactionHash,
            blockNumber: block.number,
          });
        }
      }),
    );

    const transactionEntities = await this.transactionService.findAll(
      {
        blockNumber: block.number - this.blocksToConfirm,
      },
      { relations: ["project"] },
    );

    await Promise.all(
      transactionEntities.map(async transactionEntity => {
        const tx = await this.jsonRpcProvider.getTransaction(transactionEntity.transactionHash);
        if (tx && tx.blockNumber === transactionEntity.blockNumber) {
          Object.assign(transactionEntity, {
            status: TransactionStatus.CONFIRMED,
          });
          this.watcherOutClientProxy.emit(WatcherOutType.TRANSACTION_MINED, {
            transactionHash: transactionEntity.transactionHash,
            blockNumber: block.number,
          });
        } else {
          Object.assign(transactionEntity, {
            status: TransactionStatus.ERRORED,
          });
          await transactionEntity.save();
          this.watcherOutClientProxy.emit(WatcherOutType.TRANSACTION_MINED, {
            transactionHash: transactionEntity.transactionHash,
            blockNumber: block.number,
          });
        }
        await this.transactionServiceRedis.delRecord(transactionEntity.transactionHash);
      }),
    );
  }
}
