import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IStakingBalanceWithdrawEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class StakingContractServiceEth {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  public async balanceWithdraw(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
