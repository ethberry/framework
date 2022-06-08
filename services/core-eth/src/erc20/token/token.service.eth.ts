import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc20TokenEventType,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
  TErc20TokenEventData,
} from "@framework/types";

import { Erc20TokenHistoryService } from "./token-history/token-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc20TokenServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc20TokenHistoryService: Erc20TokenHistoryService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async transfer(event: ILogEvent<IErc20TokenTransfer>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async approval(event: ILogEvent<IErc20TokenApprove>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async snapshot(event: ILogEvent<IErc20TokenSnapshot>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc20TokenEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc20TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc20TokenHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc20TokenEventType,
      eventData: args,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
