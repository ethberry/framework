import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessListEventType,
  IBlacklisted,
  IUnBlacklisted,
  IUnWhitelisted,
  IWhitelisted,
  TAccessListEventData,
} from "@framework/types";

import { AccessListHistoryService } from "./history/history.service";
import { AccessListService } from "./access-list.service";

@Injectable()
export class AccessListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessListService: AccessListService,
    private readonly accessListHistoryService: AccessListHistoryService,
  ) {}

  public async blacklisted(event: ILogEvent<IBlacklisted>, context: Log): Promise<void> {
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

  public async unBlacklisted(event: ILogEvent<IUnBlacklisted>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });
  }

  public async whitelisted(event: ILogEvent<IWhitelisted>, context: Log): Promise<void> {
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

  public async unWhitelisted(event: ILogEvent<IUnWhitelisted>, context: Log): Promise<void> {
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
    const { transactionHash, address } = context;

    await this.accessListHistoryService.create({
      address,
      transactionHash,
      eventType: name as AccessListEventType,
      eventData: args,
    });
  }
}
