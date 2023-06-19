import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangePurchaseRaffleEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class ExchangeRaffleServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  // event PurchaseRaffle(address account, Asset[] items, Asset price, uint256 roundId);
  public async purchaseRaffle(event: ILogEvent<IExchangePurchaseRaffleEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;

    // TODO find ticket-token?
    const ticketTemplate = await this.templateService.findOne(
      {
        contract: { address: items[1].token.toLowerCase() }, // lottery ticket contract
      },
      { relations: { contract: true } },
    );

    if (!ticketTemplate) {
      throw new NotFoundException("ticketTemplateNotFound");
    }

    // change contract's tokenID to DB's templateID
    Object.assign(items[1], { tokenId: ticketTemplate.id });

    const history = await this.eventHistoryService.updateHistory(event, context);

    await this.assetService.saveAssetHistory(history, [items[1]] /* [raffle, ticket] */, [price]);
  }
}
