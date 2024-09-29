import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { MessageHandler } from "@nestjs/microservices";

import { Cron } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, TransactionReceipt } from "ethers";
import { LessThan } from "typeorm";

import { DiscoveryService } from "@golevelup/nestjs-discovery";

import { ETHERS_RPC } from "@ethberry/nest-js-module-ethers-gcp";
import { testChainId } from "@framework/constants";
import { ContractType, TransactionStatus } from "@framework/types";
import { delayMs, getBlockNumber, getHandlerByPattern, getTransactionReceipt } from "../../common/utils";
import { TransactionService } from "./transaction.service";

@Injectable()
export class TransactionServiceCron {
  private cronLock;

  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly discoveryService: DiscoveryService,
  ) {
    this.cronLock = false; // lock cron jobs while processing
  }

  // TODO set up checking schedule by mean block producing time
  @Cron("*/7 * * * * *")
  public async checkTransaction(): Promise<void> {
    // CHECK CRON LOCK
    if (this.cronLock) {
      return;
    }
    this.cronLock = true;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const latency = ~~this.configService.get<number>("LATENCY", 32);

    let blockNumber;
    try {
      blockNumber = await getBlockNumber(this.jsonRpcProvider);
    } catch (e) {
      this.loggerService.error(e, TransactionServiceCron.name);
    }

    // CHECK ONLY IF GET BLOCK NUMBER
    if (blockNumber) {
      // get all CONTRACT MANAGER transactions hashes with latency
      const uniqueCMTxs = await this.transactionService.findAllTxHashes({
        chainId,
        blockNumber: LessThan(blockNumber - latency),
        contractType: ContractType.CONTRACT_MANAGER,
      });

      if (uniqueCMTxs && uniqueCMTxs.length > 0) {
        await this.processTransactions(uniqueCMTxs);
      } else {
        // get all others transactions hashes with latency
        const uniqueTxs = await this.transactionService.findAllTxHashes({
          chainId,
          blockNumber: LessThan(blockNumber - latency),
        });

        if (uniqueTxs && uniqueTxs.length > 0) {
          await this.processTransactions(uniqueTxs);
        } else {
          // RELEASE CRON LOCK
          this.cronLock = false;
        }
      }
    } else {
      this.cronLock = false;
    }
  }

  public async processTransactions(uniqueTxs: Array<string>) {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const logMode: boolean = this.configService.get<boolean>("LOG_MODE", false);
    if (logMode) {
      this.loggerService.log(`FOUND PENDING ${uniqueTxs.length} TXS, PROCESSING..`, TransactionServiceCron.name);
    }

    for (const transactionHash of uniqueTxs) {
      let txReceipt: TransactionReceipt | null = null;
      try {
        await delayMs(142);
        txReceipt = await getTransactionReceipt(transactionHash, this.jsonRpcProvider);
      } catch (e) {
        this.loggerService.error(e, TransactionServiceCron.name);
      }

      if (txReceipt) {
        const allLogs = await this.transactionService.findAllLogsByHash(transactionHash, chainId);
        // PROCESS ALL TRANSACTION'S LOGS
        for (const logEntity of allLogs) {
          // update tx status - PROCESS
          await this.transactionService.updateTxsStatus({ id: logEntity.id }, TransactionStatus.PROCESS);
          console.info(`PROCESSING JOB ${logEntity.logData.id}, route: ${logEntity.logData.route}`);
          const { logData } = logEntity;
          const discoveredMethodsWithMeta = await getHandlerByPattern(logData.route.toString(), this.discoveryService);
          // process all controllers
          await Promise.allSettled(
            discoveredMethodsWithMeta.map(discoveredMethodWithMeta => {
              return (
                discoveredMethodWithMeta.discoveredMethod.handler.bind(
                  discoveredMethodWithMeta.discoveredMethod.parentClass.instance,
                ) as MessageHandler
              )(logData.decoded, logData.context);
            }),
          )
            .then(res => {
              res.forEach(r => {
                if (r.status === "rejected") {
                  console.error(r);
                }
              });
            })
            .catch(error => {
              this.loggerService.error(error);
            });
          // update tx status - PROCESSED
          await this.transactionService.updateTxsStatus({ id: logEntity.id }, TransactionStatus.PROCESSED);
        }
      }
    }
    // RELEASE CRON LOCK
    this.cronLock = false;
  }

  // protected async getHandlerByPattern<T extends Array<Record<string, string>>>(
  //   route: string,
  //   discoveryService: DiscoveryService,
  // ): Promise<Array<DiscoveredMethodWithMeta<T>>> {
  //   const methods = await discoveryService.controllerMethodsWithMetaAtKey<T>(PATTERN_METADATA);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return methods.filter(method => {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return method.meta.some(meta => transformPatternToRoute(meta) === route);
  //   });
  // }
}
