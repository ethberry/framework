import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeCraftEvent } from "@framework/types";

import { ExchangeHistoryService } from "../history/history.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeCraftServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async craft(event: ILogEvent<IExchangeCraftEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const history = await this.exchangeHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, items, price);
  }
}
