import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ClaimStatus, IExchangeClaimEvent } from "@framework/types";

import { ClaimService } from "../../mechanics/claim/claim.service";
import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeClaimServiceEth {
  constructor(
    private readonly claimService: ClaimService,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async claim(event: ILogEvent<IExchangeClaimEvent>, context: Log): Promise<void> {
    const {
      args: { items, externalId },
    } = event;
    const history = await this.eventHistoryService.updateHistory(event, context);

    const claimEntity = await this.claimService.findOne({ id: ~~externalId });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();

    await this.assetService.saveAssetHistory(history, items, []);
  }
}
