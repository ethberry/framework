import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { IVestingERC20Released, IVestingEtherReleased, TVestingEventData, VestingEventType } from "@framework/types";

import { VestingHistoryService } from "./history/vesting-history.service";
import { ContractManagerService } from "../../contract-manager/contract-manager.service";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly vestingHistoryService: VestingHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20Released>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async ethReleased(event: ILogEvent<IVestingEtherReleased>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TVestingEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), VestingServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.vestingHistoryService.create({
      address,
      transactionHash,
      eventType: name as VestingEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
