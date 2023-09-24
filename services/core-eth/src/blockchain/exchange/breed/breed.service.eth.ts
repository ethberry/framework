import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeBreedEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class ExchangeBreedServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    private readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async breed(event: ILogEvent<IExchangeBreedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, matron, sire },
    } = event;
    const { transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const _assets = await this.assetService.saveAssetHistory(history, [matron], [sire]);

    // this.notificatorService.breed({
    //   account,
    //   ...assets,
    //   transactionHash,
    // });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
