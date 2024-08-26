import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "ethers";
import Queue from "bee-queue";

import { testChainId } from "@framework/constants";
import { ContractType, TransactionStatus } from "@framework/types";
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
    contractType: ContractType;
  };
}

@Injectable()
export class TransactionServiceRedis {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
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
    getQueue.process(42, async (job: IRedisJob, _done: any): Promise<TransactionEntity> => {
      console.info(`SAVING JOB ${job.id}, route: ${job.data.route}`);

      const { route, decoded, context, contractType } = job.data;
      const { transactionHash, blockNumber, transactionIndex, logIndex } = context;
      return this.transactionService.create({
        chainId,
        transactionHash,
        contractType,
        blockNumber: Number(blockNumber),
        transactionIndex: Number(transactionIndex),
        logIndex: Number(logIndex),
        logData: { id: job.id, route, decoded, context },
        transactionStatus: TransactionStatus.PENDING,
      });
    });
  }
}
