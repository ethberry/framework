import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type {
  IVestingERC20ReleasedEvent,
  IVestingEtherReceivedEvent,
  IVestingEtherReleasedEvent,
  TVestingEventData,
} from "@framework/types";
import { IOwnershipTransferredEvent, VestingEventType } from "@framework/types";

import { VestingHistoryService } from "./history/vesting-history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { VestingService } from "./vesting.service";

@Injectable()
export class VestingServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly vestingService: VestingService,
    private readonly vestingHistoryService: VestingHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async erc20Released(event: ILogEvent<IVestingERC20ReleasedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async ethReleased(event: ILogEvent<IVestingEtherReleasedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async ethReceived(event: ILogEvent<IVestingEtherReceivedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async ownershipChanged(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    const {
      args: { newOwner, previousOwner },
    } = event;

    await this.updateHistory(event, context);

    await this.vestingService.update(
      {
        account: previousOwner.toLowerCase(),
      },
      { account: newOwner.toLowerCase() },
    );
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

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
