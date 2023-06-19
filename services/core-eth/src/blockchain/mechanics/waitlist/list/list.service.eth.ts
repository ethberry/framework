import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IWaitListRewardClaimedEvent, IWaitListRewardSetEvent } from "@framework/types";
import { WaitListStatus } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { WaitListItemService } from "../item/item.service";
import { WaitListListService } from "./list.service";

@Injectable()
export class WaitListListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
    private readonly waitListListService: WaitListListService,
    private readonly waitListItemService: WaitListItemService,
  ) {}

  public async rewardSet(event: ILogEvent<IWaitListRewardSetEvent>, context: Log): Promise<void> {
    const {
      args: { externalId, root },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const waitListListEntity = await this.waitListListService.findOne(
      { id: Number(externalId) },
      {
        join: {
          alias: "wait_list_list",
          leftJoinAndSelect: {
            item: "wait_list_list.item",
            item_components: "item.components",
            item_template: "item_components.template",
            item_contract: "item_components.contract",
          },
        },
      },
    );

    if (!waitListListEntity) {
      this.loggerService.error("waitListNotFound", externalId, WaitListListServiceEth.name);
      throw new NotFoundException("waitListNotFound");
    }

    Object.assign(waitListListEntity, {
      root,
    });

    await waitListListEntity.save();

    await this.notificatorService.rewardSet({
      waitListList: waitListListEntity,
      transactionHash,
    });
  }

  public async rewardClaimed(event: ILogEvent<IWaitListRewardClaimedEvent>, context: Log): Promise<void> {
    const {
      args: { account, externalId },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const waitListItemEntity = await this.waitListItemService.findOne(
      {
        account,
        list: {
          id: Number(externalId),
        },
      },
      {
        join: {
          alias: "wait_list_item",
          leftJoinAndSelect: {
            list: "wait_list_item.wait_list_list",
            item: "wait_list_list.item",
            item_components: "item.components",
            item_template: "item_components.template",
            item_contract: "item_components.contract",
          },
        },
      },
    );

    if (!waitListItemEntity) {
      this.loggerService.error("waitListNotFound", externalId, WaitListListServiceEth.name);
      throw new NotFoundException("waitListNotFound");
    }

    Object.assign(waitListItemEntity, { waitListStatus: WaitListStatus.REDEEMED });
    await waitListItemEntity.save();

    await this.notificatorService.rewardClaimed({
      waitListItem: waitListItemEntity,
      transactionHash,
    });
  }
}
