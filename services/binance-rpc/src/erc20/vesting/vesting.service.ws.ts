import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc20VestingEventType,
  IErc20VestingERC20Released,
  IErc20VestingEtherReleased,
  TErc20VestingEventData,
} from "@framework/types";

import { Erc20VestingHistoryService } from "../vesting-history/vesting-history.service";

@Injectable()
export class Erc20VestingServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20VestingHistoryService: Erc20VestingHistoryService,
  ) {}

  public async erc20Released(event: IEvent<IErc20VestingERC20Released>): Promise<void> {
    await this.updateHistory(event);
  }

  public async ethReleased(event: IEvent<IErc20VestingEtherReleased>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc20VestingEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20VestingServiceWs.name);

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.erc20VestingHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc20VestingEventType,
      eventData: returnValues,
    });
  }
}
