import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IErc1363TransferReceivedEvent, IExchangePurchaseEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeCoreServiceEth {
  constructor(private readonly assetService: AssetService, private readonly eventHistoryService: EventHistoryService) {}

  public async purchase(event: ILogEvent<IExchangePurchaseEvent>, context: Log): Promise<void> {
    const {
      args: { item, price },
    } = event;

    const history = await this.eventHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [item], price);
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
