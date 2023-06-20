import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IWaitListItem, IWaitListList } from "@framework/types";

export interface IRmqCWaitListList {
  transactionHash: string;
  waitListList: IWaitListList;
}

export interface IRmqCWaitListItem {
  transactionHash: string;
  waitListItem: IWaitListItem;
}

@Injectable()
export class WaitListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async rewardSet(dto: IRmqCWaitListList): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }

  public async rewardClaimed(dto: IRmqCWaitListItem): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }
}
