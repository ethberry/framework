import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeBreedEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";

@Injectable()
export class ExchangeBreedServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async breed(event: ILogEvent<IExchangeBreedEvent>, context: Log): Promise<void> {
    const {
      args: { matron, sire },
    } = event;
    const history = await this.eventHistoryService.updateHistory(event, context);

    const _assets = await this.assetService.saveAssetHistory(history, [matron], [sire]);

    // this.notificatorService.breed({
    //   account,
    //   ...assets,
    //   transactionHash,
    // });
  }
}
