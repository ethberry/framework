import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessListEventType,
  IBlacklistedEvent,
  IUnBlacklistedEvent,
  IUnWhitelistedEvent,
  IWhitelistedEvent,
  TAccessListEventData,
} from "@framework/types";

import { AccessListHistoryService } from "./history/history.service";
import { AccessListService } from "./access-list.service";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class AccessListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessListService: AccessListService,
    private readonly accessListHistoryService: AccessListHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async blacklisted(event: ILogEvent<IBlacklistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessListService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      allowance: false,
    });
  }

  public async unBlacklisted(event: ILogEvent<IUnBlacklistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });
  }

  public async whitelisted(event: ILogEvent<IWhitelistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessListService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      allowance: true,
    });
  }

  public async unWhitelisted(event: ILogEvent<IUnWhitelistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });
  }

  private async updateHistory(event: ILogEvent<TAccessListEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), AccessListServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.accessListHistoryService.create({
      address,
      transactionHash,
      eventType: name as AccessListEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
