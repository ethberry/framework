import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeGradeEvent } from "@framework/types";

import { ExchangeHistoryService } from "../history/history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { OpenSeaService } from "../../../integrations/opensea/opensea.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeGradeServiceEth {
  constructor(
    private readonly tokenService: TokenService,
    private readonly openSeaService: OpenSeaService,
    private readonly assetService: AssetService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
  ) {}

  public async upgrade(event: ILogEvent<IExchangeGradeEvent>, context: Log): Promise<void> {
    const {
      args: { item, price },
    } = event;

    const history = await this.exchangeHistoryService.updateHistory(event, context);
    await this.assetService.saveAssetHistory(history, [item], price);

    const [, itemTokenAddr, itemTokenId] = item;

    const tokenEntity = await this.tokenService.getToken(itemTokenId, itemTokenAddr.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.openSeaService.metadataUpdate(tokenEntity);
  }
}
