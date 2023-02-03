import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangePurchaseEvent } from "@framework/types";

import { ExchangeHistoryService } from "../history/history.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeCoreServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async purchase(event: ILogEvent<IExchangePurchaseEvent>, context: Log): Promise<void> {
    const {
      args: { item, price },
    } = event;

    const history = await this.exchangeHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [item], price);
  }
}
