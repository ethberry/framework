import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
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

  // event PurchaseLottery(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, bytes32 numbers);
  public async purchaseLottery(event: ILogEvent<IExchangePurchaseLotteryEvent>, context: Log): Promise<void> {
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
      throw new NotFoundException("lotteryTicketTemplateNotFound");
    }

    // change contract's tokenID to DB's templateID
    Object.assign(item, { tokenId: ticketTemplate.id });

    const history = await this.eventHistoryService.updateHistory(event, context);

    const assets = await this.assetService.saveAssetHistory(history, [item] /* [ticket] */, [price]);

    await this.notificatorService.purchaseLottery({
      ...assets,
      address,
      transactionHash,
    });
  }
}
