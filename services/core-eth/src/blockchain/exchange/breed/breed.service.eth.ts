import { Injectable } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeBreedEvent } from "@framework/types";

import { ExchangeHistoryService } from "../history/history.service";
import { AssetService } from "../asset/asset.service";
import { BreedServiceEth } from "../../mechanics/breed/breed.service.eth";

@Injectable()
export class ExchangeBreedServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly breedServiceEth: BreedServiceEth,
  ) {}

  public async breed(event: ILogEvent<IExchangeBreedEvent>, context: Log): Promise<void> {
    const {
      args: { matron, sire },
    } = event;
    const history = await this.exchangeHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [matron], [sire]);

    await this.breedServiceEth.breed(event, history.id);
  }
}
