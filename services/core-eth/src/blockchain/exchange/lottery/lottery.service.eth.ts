import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangePurchaseLotteryEvent } from "@framework/types";

import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class ExchangeLotteryServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly templateService: TemplateService,
  ) {}

  // event PurchaseLottery(address account, Asset[] items, Asset price, uint256 roundId, bytes32 numbers);
  public async purchaseLottery(event: ILogEvent<IExchangePurchaseLotteryEvent>, context: Log): Promise<void> {
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

    await this.assetService.saveAssetHistory(history, [items[1]] /* [lottery, ticket] */, [price]);
  }
}
