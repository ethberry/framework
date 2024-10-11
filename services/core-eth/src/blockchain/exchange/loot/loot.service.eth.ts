import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangePurchaseLootBoxEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AssetService } from "../asset/asset.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class ExchangeLootServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async log(event: ILogEvent<IExchangePurchaseLootBoxEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, item, price },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);
    const assets = await this.assetService.saveAssetHistory(history, [item], price);

    await this.notificatorService.purchaseLoot({
      ...assets,
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
