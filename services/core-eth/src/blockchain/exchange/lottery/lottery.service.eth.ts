import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IExchangePurchaseLotteryEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeLotteryServiceEth {
  constructor(
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly templateService: TemplateService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async purchaseLottery(event: ILogEvent<IExchangePurchaseLotteryEvent>, context: Log): Promise<void> {
    const {
      args: { account, items, price },
    } = event;
    const { transactionHash } = context;

    // TODO find ticket-token?
    const ticketTemplate = await this.templateService.findOne(
      {
        contract: { address: items[1].token.toLowerCase() }, // lottery ticket contract
      },
      { relations: { contract: true } },
    );

    if (!ticketTemplate) {
      throw new NotFoundException("lotteryTicketTemplateNotFound");
    }

    // change contract's tokenID to DB's templateID
    Object.assign(items[1], { tokenId: ticketTemplate.id });

    const history = await this.eventHistoryService.updateHistory(event, context);

    const assets = await this.assetService.saveAssetHistory(history, [items[1]] /* [lottery, ticket] */, [price]);

    this.notificatorService.purchaseLottery({
      account,
      ...assets,
      transactionHash,
    });
  }
}
