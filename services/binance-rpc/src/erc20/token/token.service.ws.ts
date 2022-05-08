import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc20TokenEventType,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
  TErc20TokenEventData,
} from "@framework/types";

import { Erc20TokenHistoryService } from "../token-history/token-history.service";

@Injectable()
export class Erc20TokenServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20TokenHistoryService: Erc20TokenHistoryService,
  ) {}

  public async transfer(event: IEvent<IErc20TokenTransfer>): Promise<void> {
    await this.updateHistory(event);
  }

  public async approval(event: IEvent<IErc20TokenApprove>): Promise<void> {
    await this.updateHistory(event);
  }

  public async snapshot(event: IEvent<IErc20TokenSnapshot>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc20TokenEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"));

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.erc20TokenHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc20TokenEventType,
      eventData: returnValues,
    });
  }
}
