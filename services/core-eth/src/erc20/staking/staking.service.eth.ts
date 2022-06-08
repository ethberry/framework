import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc20StakingEventType,
  IErc20StakingDeposit,
  IErc20StakingWithdraw,
  TErc20StakingEventData,
} from "@framework/types";

import { Erc20StakingHistoryService } from "./staking-history/staking-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc20StakingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20HistoryService: Erc20StakingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async start(event: ILogEvent<IErc20StakingDeposit>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async withdraw(event: ILogEvent<IErc20StakingWithdraw>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc20StakingEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20StakingServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc20HistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc20StakingEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
