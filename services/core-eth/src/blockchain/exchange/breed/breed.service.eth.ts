import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeBreedEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { BreedServiceEth } from "../../mechanics/breed/breed.service.eth";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeBreedServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly breedServiceEth: BreedServiceEth,
  ) {}

  public async breed(event: ILogEvent<IExchangeBreedEvent>, context: Log): Promise<void> {
    const {
      args: { matron, sire },
    } = event;
    const history = await this.eventHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [matron], [sire]);
  }
}
