import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IStakingBalanceWithdrawEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class StakingContractServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async balanceWithdraw(event: ILogEvent<IStakingBalanceWithdrawEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { owner },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
