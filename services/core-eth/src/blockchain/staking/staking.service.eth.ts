import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { StakingEventType, IStakingDeposit, IStakingWithdraw, TStakingEventData } from "@framework/types";

import { StakingHistoryService } from "./staking-history/staking-history.service";
import { ContractManagerService } from "../contract-manager/contract-manager.service";

@Injectable()
export class StakingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly HistoryService: StakingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async start(event: ILogEvent<IStakingDeposit>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async withdraw(event: ILogEvent<IStakingWithdraw>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TStakingEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), StakingServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.HistoryService.create({
      address,
      transactionHash,
      eventType: name as StakingEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
