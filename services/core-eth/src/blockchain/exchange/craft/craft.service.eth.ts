import { Injectable, Inject, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeCraftEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { CraftService } from "../../mechanics/craft/craft.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeCraftServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly craftService: CraftService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async craft(event: ILogEvent<IExchangeCraftEvent>, context: Log): Promise<void> {
    const {
      args: { items, price, externalId },
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
  }
}
