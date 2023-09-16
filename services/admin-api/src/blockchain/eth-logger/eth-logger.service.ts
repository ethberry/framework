import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { RmqProviderType } from "@framework/types";
import type { IEthLoggerInOutDto } from "./interfaces";
import { RedisProviderType } from "../../common/providers";
import Queue from "bee-queue";

@Injectable()
export class EthLoggerService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.WATCHER_IN_SERVICE)
    private readonly loggerInProxy: ClientProxy,
    @Inject(RmqProviderType.WATCHER_OUT_SERVICE)
    private readonly loggerOutProxy: ClientProxy,
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
        console.log("JOB CREATED", job.id);
        // job enqueued, job.id populated
      });
    return this.loggerInProxy.emit(RmqProviderType.WATCHER_IN_SERVICE, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    return this.loggerOutProxy.emit(RmqProviderType.WATCHER_OUT_SERVICE, dto).toPromise();
  }
}
