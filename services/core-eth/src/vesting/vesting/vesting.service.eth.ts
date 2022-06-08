import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc20VestingEventType,
  IErc20VestingERC20Released,
  IErc20VestingEtherReleased,
  TErc20VestingEventData,
} from "@framework/types";

import { Erc20VestingHistoryService } from "../vesting-history/vesting-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc20VestingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20VestingHistoryService: Erc20VestingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async erc20Released(event: ILogEvent<IErc20VestingERC20Released>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async ethReleased(event: ILogEvent<IErc20VestingEtherReleased>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc20VestingEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20VestingServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc20VestingHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc20VestingEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
