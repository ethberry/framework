import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc20StakingEventType,
  IErc20StakingDeposit,
  IErc20StakingWithdraw,
  TErc20StakingEventData,
} from "@framework/types";

import { Erc20StakingHistoryService } from "../staking-history/staking-history.service";

@Injectable()
export class Erc20StakingServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20HistoryService: Erc20StakingHistoryService,
  ) {}

  public async start(event: IEvent<IErc20StakingDeposit>): Promise<void> {
    await this.updateHistory(event);
  }

  public async withdraw(event: IEvent<IErc20StakingWithdraw>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc20StakingEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"));

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.erc20HistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc20StakingEventType,
      eventData: returnValues,
    });
  }
}
