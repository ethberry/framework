import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IWaitListRewardClaimedEvent, IWaitListRewardSetEvent } from "@framework/types";
import { RmqProviderType, SignalEventType, WaitListItemStatus } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";
import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { WaitListItemService } from "../item/item.service";
import { WaitListListService } from "./list.service";

@Injectable()
export class WaitListListServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
    private readonly waitListListService: WaitListListService,
    private readonly waitListItemService: WaitListItemService,
  ) {}

  public async rewardSet(event: ILogEvent<IWaitListRewardSetEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { externalId, root },
    } = event;
    const { transactionHash, address } = context;

    const waitListListEntity = await this.waitListListService.findOne(
      { id: Number(externalId) },
      {
        join: {
          alias: "wait_list_list",
          leftJoinAndSelect: {
            contract: "wait_list_list.contract",
            merchant: "contract.merchant",
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

    await this.eventHistoryService.updateHistory(event, context, void 0, waitListListEntity.contractId);

    Object.assign(waitListListEntity, {
      root,
    });

    await waitListListEntity.save();

    await this.notificatorService.rewardSet({
      waitListList: waitListListEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: waitListListEntity.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async rewardClaimed(event: ILogEvent<IWaitListRewardClaimedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, externalId },
    } = event;
    const { transactionHash, address } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const waitListItemEntity = await this.waitListItemService.findOne(
      {
        account: account.toLowerCase(),
        list: {
          id: Number(externalId),
        },
      },
      {
        join: {
          alias: "wait_list_item",
          leftJoinAndSelect: {
            list: "wait_list_item.list",
            item: "list.item",
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

    Object.assign(waitListItemEntity, { waitListItemStatus: WaitListItemStatus.REDEEMED });
    await waitListItemEntity.save();

    await this.notificatorService.rewardClaimed({
      waitListItem: waitListItemEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
