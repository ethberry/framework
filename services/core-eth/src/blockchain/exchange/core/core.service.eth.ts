import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IErc1363TransferReceivedEvent, IExchangePurchaseEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeCoreServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async purchase(event: ILogEvent<IExchangePurchaseEvent>, context: Log): Promise<void> {
    const {
      args: { account, item, price },
    } = event;
    const { transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const assets = await this.assetService.saveAssetHistory(history, [item], price);

    this.notificatorService.purchase({
      account,
      ...assets,
      transactionHash,
    });
  }

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
