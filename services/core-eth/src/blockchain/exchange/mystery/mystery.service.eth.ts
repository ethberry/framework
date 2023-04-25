import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeMysteryEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeMysteryServiceEth {
  constructor(private readonly assetService: AssetService, private readonly eventHistoryService: EventHistoryService) {}

  public async log(event: ILogEvent<IExchangeMysteryEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const history = await this.eventHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, [items[items.length - 1]], price);
  }
}
