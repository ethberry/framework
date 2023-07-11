import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IExchangePurchaseRaffleEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeRaffleServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  // event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId);
  public async purchaseRaffle(event: ILogEvent<IExchangePurchaseRaffleEvent>, context: Log): Promise<void> {
    const {
      args: { item, price },
    } = event;
    const { address, transactionHash } = context;

    const ticketTemplate = await this.templateService.findOne(
      {
        contract: { address: item.token.toLowerCase() }, // lottery ticket contract
      },
      { relations: { contract: true } },
    );

    if (!ticketTemplate) {
      throw new NotFoundException("raffleTicketTemplateNotFound");
    }

    // change contract's tokenID to DB's templateID
    Object.assign(item, { tokenId: ticketTemplate.id });

    const history = await this.eventHistoryService.updateHistory(event, context);

    const assets = await this.assetService.saveAssetHistory(history, [item], [price]);

    await this.notificatorService.purchaseRaffle({
      ...assets,
      address,
      transactionHash,
    });
  }
}
