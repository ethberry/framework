import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { MessageHandler } from "@nestjs/microservices";

import { PATTERN_METADATA } from "@nestjs/microservices/constants";
import { transformPatternToRoute } from "@nestjs/microservices/utils";

import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider } from "ethers";
import { LessThan } from "typeorm";

import { DiscoveredMethodWithMeta, DiscoveryService } from "@golevelup/nestjs-discovery";

import { ETHERS_RPC } from "@gemunion/nest-js-module-ethers-gcp";
import { testChainId } from "@framework/constants";
import { TransactionStatus } from "@framework/types";
import { getBlockNumber, getTransactionReceipt } from "../../common/utils";
import { TransactionService } from "./transaction.service";

@Injectable()
export class TransactionServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly discoveryService: DiscoveryService,
  ) {}

  // TODO set up checking schedule by mean block producing time
  @Cron(CronExpression.EVERY_30_SECONDS)
  public async checkTransaction(): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const latency = ~~this.configService.get<number>("LATENCY", 32);
    const blockNumber = await getBlockNumber(this.jsonRpcProvider);

    // get all transactions hashes with latency
    const uniqueTxs = await this.transactionService.findAllTxHashes({
      chainId,
      blockNumber: LessThan(blockNumber - latency),
    });

    if (uniqueTxs && uniqueTxs.length > 0) {
      uniqueTxs.map(async transactionHash => {
        try {
          const txReceipt = await getTransactionReceipt(transactionHash, this.jsonRpcProvider);
          // transaction must exist in blockchain
          if (txReceipt) {
            const allLogs = await this.transactionService.findAllLogsByHash(transactionHash, chainId);
            // process all transaction's logs
            allLogs.map(async logEntity => {
              // change tx status - PROCESS
              await this.transactionService.updateTxsStatus({ id: logEntity.id }, TransactionStatus.PROCESS);

              console.info(`PROCESSING JOB ${logEntity.logData.id}, route: ${logEntity.logData.route}`);
              const { logData } = logEntity;

              const discoveredMethodsWithMeta = await this.getHandlerByPattern(
                logData.route.toString(),
                this.discoveryService,
              );

              // process all controllers
              discoveredMethodsWithMeta.map(discoveredMethodWithMeta => {
                return (
                  discoveredMethodWithMeta.discoveredMethod.handler.bind(
                    discoveredMethodWithMeta.discoveredMethod.parentClass.instance,
                  ) as MessageHandler
                )(logData.decoded, logData.context);
              });

              // update success status
              return await this.transactionService.updateTxsStatus(
                { transactionHash, chainId },
                TransactionStatus.PROCESSED,
              );
            });
          }
        } catch (e) {
          this.loggerService.error(e, TransactionServiceCron.name);
        }
      });
    }
  }

  protected async getHandlerByPattern<T extends Array<Record<string, string>>>(
    route: string,
    discoveryService: DiscoveryService,
  ): Promise<Array<DiscoveredMethodWithMeta<T>>> {
    const methods = await discoveryService.controllerMethodsWithMetaAtKey<T>(PATTERN_METADATA);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return methods.filter(method => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return method.meta.some(meta => transformPatternToRoute(meta) === route);
    });
  }
}
