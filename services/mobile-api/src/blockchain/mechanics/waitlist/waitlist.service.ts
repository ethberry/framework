import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IWaitListList, IWaitListItem } from "@framework/types";

@Injectable()
export class WaitListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async rewardSet(dto: IWaitListList): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }

  public async rewardClaimed(dto: IWaitListItem): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), WaitListService.name);
  }
}
