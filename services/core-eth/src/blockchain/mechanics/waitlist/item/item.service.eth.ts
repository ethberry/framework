import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IWaitlistClaimRewardEvent, IWaitlistSetRewardEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class WaitlistItemServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async rewardSet(event: ILogEvent<IWaitlistSetRewardEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async claimReward(event: ILogEvent<IWaitlistClaimRewardEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
