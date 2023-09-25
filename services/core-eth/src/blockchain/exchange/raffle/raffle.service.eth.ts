import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangePurchaseRaffleEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetService } from "../asset/asset.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class ExchangeRaffleServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    private readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  // event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, uint256 index);
  public async purchaseRaffle(event: ILogEvent<IExchangePurchaseRaffleEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, item, price, index },
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

    await this.notificatorService.rafflePurchase({
      ...assets,
      address,
      index,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
