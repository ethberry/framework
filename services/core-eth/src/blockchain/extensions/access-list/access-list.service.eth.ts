import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IBlacklistedEvent, IUnBlacklistedEvent, IUnWhitelistedEvent, IWhitelistedEvent } from "@framework/types";
import { AccessListService } from "./access-list.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class AccessListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessListService: AccessListService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async blacklisted(event: ILogEvent<IBlacklistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

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

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });
  }

  public async whitelisted(event: ILogEvent<IWhitelistedEvent>, context: Log): Promise<void> {
    const {
      args: { account },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

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

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessListService.remove({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
    });
  }
}
