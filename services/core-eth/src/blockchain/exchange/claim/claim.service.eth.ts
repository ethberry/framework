import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ClaimStatus } from "@framework/types";
import type { IExchangeClaimEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ClaimService } from "../../mechanics/claim/claim.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeClaimServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly claimService: ClaimService,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async claim(event: ILogEvent<IExchangeClaimEvent>, context: Log): Promise<void> {
    const {
      args: { items, externalId },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const claimEntity = await this.claimService.findOne(
      { id: Number(externalId) },
      {
        join: {
          alias: "claim",
          leftJoinAndSelect: {
            item: "claim.item",
            item_components: "item.components",
            item_template: "item_components.template",
            item_contract: "item_components.contract",
          },
        },
      },
    );

    if (!claimEntity) {
      this.loggerService.error("claimNotFound", externalId, ExchangeClaimServiceEth.name);
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();

    await this.assetService.saveAssetHistory(history, items, []);

    await this.notificatorService.claim({
      claim: claimEntity,
      address,
      transactionHash,
    });
  }
}
