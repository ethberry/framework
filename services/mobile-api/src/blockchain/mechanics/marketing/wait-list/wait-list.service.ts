import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IRmqWaitListItem, IRmqWaitListList } from "./interface";

@Injectable()
export class WaitListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async rewardSet(dto: IRmqWaitListList): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }

  public async rewardClaimed(dto: IRmqWaitListItem): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }
}
