import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IClaimRewardEvent, IRewardSetEvent } from "@framework/types";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class WaitlistItemServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async rewardSet(event: ILogEvent<IRewardSetEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async claimReward(event: ILogEvent<IClaimRewardEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
