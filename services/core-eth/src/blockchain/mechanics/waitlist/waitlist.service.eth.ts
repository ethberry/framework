import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ExchangeEventType, IClaimRewardEvent, IRewardSetEvent, TExchangeEventData } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { ExchangeHistoryService } from "../exchange/history/exchange-history.service";

@Injectable()
export class WaitlistServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async rewardSet(event: ILogEvent<IRewardSetEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async claimReward(event: ILogEvent<IClaimRewardEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), WaitlistServiceEth.name);

    const { args, name } = event;

    const { transactionHash, address, blockNumber } = context;

    await this.exchangeHistoryService.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
