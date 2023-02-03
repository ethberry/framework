import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeMysteryEvent } from "@framework/types";

import { ExchangeHistoryService } from "../history/history.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeMysteryServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async log(event: ILogEvent<IExchangeMysteryEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const history = await this.exchangeHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, [items], price);
  }
}
