import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import type { IWaitListList } from "@framework/types";

@Injectable()
export class WaitListService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async rewardSet(dto: IWaitListList): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(dto, WaitListService.name);
  }

  public async rewardClaimed(dto: IWaitListList): Promise<void> {
    await Promise.resolve();
    this.loggerService.log(dto, WaitListService.name);
  }
}
