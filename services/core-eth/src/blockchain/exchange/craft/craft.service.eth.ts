import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeCraftEvent } from "@framework/types";
import { RmqProviderType, SignalEventType } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { CraftService } from "../../mechanics/recipes/craft/craft.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeCraftServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly craftService: CraftService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async craft(event: ILogEvent<IExchangeCraftEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, items, price, externalId },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, items, price);

    const craftEntity = await this.craftService.findOne({ id: externalId });

    if (!craftEntity) {
      this.loggerService.error("craftNotFound", externalId, ExchangeCraftServiceEth.name);
      throw new NotFoundException("craftNotFound");
    }

    await this.notificatorService.craft({
      craft: craftEntity,
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
