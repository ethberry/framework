import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeDismantleEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { DismantleService } from "../../mechanics/recipes/dismantle/dismantle.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeDismantleServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly dismantleService: DismantleService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async dismantle(event: ILogEvent<IExchangeDismantleEvent>, context: Log): Promise<void> {
    const {
      args: { items, price, externalId },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, items, price);

    const dismantleEntity = await this.dismantleService.findOne({ id: externalId });

    if (!dismantleEntity) {
      this.loggerService.error("dismantleNotFound", externalId, ExchangeDismantleServiceEth.name);
      throw new NotFoundException("dismantleNotFound");
    }

    await this.notificatorService.dismantle({
      dismantle: dismantleEntity,
      address,
      transactionHash,
    });
  }
}
