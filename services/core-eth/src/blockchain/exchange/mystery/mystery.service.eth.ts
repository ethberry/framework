import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangePurchaseMysteryBoxEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeMysteryServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async log(event: ILogEvent<IExchangePurchaseMysteryBoxEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const assets = await this.assetService.saveAssetHistory(history, [items[0]], price);

    await this.notificatorService.purchaseMystery({
      ...assets,
      address,
      transactionHash,
    });
  }
}
