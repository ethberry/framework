import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";
import Queue from "bee-queue";

import { testChainId } from "@framework/constants";
import { TransactionStatus } from "@framework/types";
import { TransactionService } from "./transaction.service";
import { TransactionEntity } from "./transaction.entity";

export interface ILogWithIndex extends Log {
  logIndex: string;
}

export interface IRedisJob {
  id: string;
  data: {
    route: string;
    decoded: any;
    context: ILogWithIndex;
  };
}

@Injectable()
export class TransactionServiceRedis {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService, // private readonly discoveryService: DiscoveryService,
  ) {}

  public processQueue(): void {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const redisQueueName = this.configService.get<string>("REDIS_QUEUE_NAME", "ETH_EVENTS");
    const sharedConfigWorker = {
      redis: {
        url: this.configService.get<string>("REDIS_WS_URL", "redis://localhost:6379/"),
      },
      storeJobs: false,
      sendEvents: false,
      getEvents: false,
    };

    const getQueue = new Queue(redisQueueName, sharedConfigWorker);
    // Saving jobs
    // getQueue.process(42, async (job: IRedisJob, _done: any): Promise<Observable<any>> => {
    getQueue.process(42, async (job: IRedisJob, _done: any): Promise<TransactionEntity> => {
      console.info(`SAVING JOB ${job.id}, route: ${job.data.route}`);

      const { route, decoded, context } = job.data;
      const { transactionHash, blockNumber, transactionIndex, logIndex } = context;
      return await this.transactionService.create({
        chainId,
        transactionHash,
        blockNumber: Number(blockNumber),
        transactionIndex: Number(transactionIndex),
        logIndex: Number(logIndex),
        logData: { id: job.id, route, decoded, context },
        transactionStatus: TransactionStatus.PENDING,
      });

      // PROCESS EVENTS
      // const discoveredMethodsWithMeta = await this.getHandlerByPattern(job.data.route, this.discoveryService);
      // if (!discoveredMethodsWithMeta.length) {
      //   console.info(`Handler not found for: ${job.data.route}`);
      //   return Promise.reject(EMPTY);
      // }
      //
      // return await Promise.allSettled(
      //   discoveredMethodsWithMeta.map(discoveredMethodWithMeta => {
      //     return (
      //       discoveredMethodWithMeta.discoveredMethod.handler.bind(
      //         discoveredMethodWithMeta.discoveredMethod.parentClass.instance,
      //       ) as MessageHandler
      //     )(job.data.decoded, job.data.context);
      //   }),
      // ).then(res => {
      //   res.forEach(r => {
      //     if (r.status === "rejected") {
      //       console.error(r);
      //     }
      //   });
      //   return from(["OK"]);
      // });
    });
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
