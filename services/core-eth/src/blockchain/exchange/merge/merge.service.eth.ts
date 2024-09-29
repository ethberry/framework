import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeMergeEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AssetService } from "../asset/asset.service";
import { RmqProviderType, SignalEventType } from "@framework/types";
import { MergeService } from "../../mechanics/gaming/recipes/merge/merge.service";

@Injectable()
export class ExchangeMergeServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly mergeService: MergeService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async merge(event: ILogEvent<IExchangeMergeEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, items, price, externalId },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const mergeEntity = await this.mergeService.findOne(
      { id: externalId },
      {
        relations: {
          item: {
            components: true,
          },
        },
      },
    );

    if (!mergeEntity) {
      this.loggerService.error("mergeNotFound", externalId, ExchangeMergeServiceEth.name);
      throw new NotFoundException("mergeNotFound");
    }
    // const { components } = mergeEntity.item;
    // const mergeItems = items.map(item => ~~item.tokenType === 4
    //   ? Object.assign(item, {tokenId: components.filter(comp => comp.contract.address === item.token.toLowerCase() && comp.)}))
    await this.assetService.saveAssetHistory(history, items, price);

    await this.notificatorService.merge({
      merge: mergeEntity,
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
