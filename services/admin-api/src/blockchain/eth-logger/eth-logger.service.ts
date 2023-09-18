import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import Queue from "bee-queue";

import { CoreEthType, RmqProviderType } from "@framework/types";

import { RedisProviderType } from "../../common/providers";
import type { IEthLoggerInOutDto } from "./interfaces";

@Injectable()
export class EthLoggerService {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.CORE_ETH_SERVICE)
    private readonly coreEthServiceProxy: ClientProxy,
    @Inject(RedisProviderType.QUEUE_IN_SERVICE)
    private readonly txInQueue: Queue,
  ) {}

  public async addListener(dto: IEthLoggerInOutDto): Promise<any> {
    const job = this.txInQueue.createJob({ x: 2, y: 3, dto });
    await job
      .timeout(3000)
      .retries(2)
      .save()
      .then((job: any) => {
        this.loggerService.log("JOB CREATED", job.id);
        // job enqueued, job.id populated
      });
    return this.coreEthServiceProxy.emit(CoreEthType.ADD_LISTENER, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.coreEthServiceProxy.emit(CoreEthType.REMOVE_LISTENER, dto).toPromise();
  }
}
