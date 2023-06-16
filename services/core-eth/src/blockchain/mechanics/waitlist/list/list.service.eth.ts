import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IWaitListRewardClaimedEvent, IWaitListRewardSetEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { WaitListListService } from "./list.service";

@Injectable()
export class WaitListListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
    private readonly waitListListService: WaitListListService,
  ) {}

  public async rewardSet(event: ILogEvent<IWaitListRewardSetEvent>, context: Log): Promise<void> {
    const {
      args: { externalId },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    // TODO check type
    const waitListEntity = await this.waitListListService.findOne(
      { id: Number(externalId) },
      {
        relations: {
          items: true,
        },
      },
    );

    if (!waitListEntity) {
      this.loggerService.error("waitListNotFound", ~~externalId, WaitListListServiceEth.name);
      throw new NotFoundException("waitListNotFound");
    }

    await this.notificatorService.rewardSet({
      waitList: waitListEntity,
      transactionHash,
    });
  }

  public async rewardClaimed(event: ILogEvent<IWaitListRewardClaimedEvent>, context: Log): Promise<void> {
    const {
      args: { externalId },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    // TODO check type
    const waitListEntity = await this.waitListListService.findOne(
      { id: Number(externalId) },
      {
        relations: {
          items: true,
        },
      },
    );

    if (!waitListEntity) {
      this.loggerService.error("waitListNotFound", ~~externalId, WaitListListServiceEth.name);
      throw new NotFoundException("waitListNotFound");
    }

    await this.notificatorService.rewardClaimed({
      waitList: waitListEntity,
      transactionHash,
    });
  }
}
