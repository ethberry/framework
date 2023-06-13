import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangePurchaseLotteryEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeLotteryServiceEth {
  constructor(private readonly assetService: AssetService, private readonly eventHistoryService: EventHistoryService) {}

  public async purchaseLottery(event: ILogEvent<IExchangePurchaseLotteryEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;

    const history = await this.eventHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [items[1]] /* [lottery, ticket] */, [price]);
  }
}