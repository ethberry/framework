import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeDismantleEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { DismantleService } from "../../mechanics/recipes/dismantle/dismantle.service";
import { AssetService } from "../asset/asset.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class ExchangeDismantleServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly dismantleService: DismantleService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async dismantle(event: ILogEvent<IExchangeDismantleEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, items, price, externalId },
    } = event;
    const { address, transactionHash } = context;

    const history = await this.eventHistoryService.updateHistory(event, context);

    const dismantleEntity = await this.dismantleService.findOne(
      { id: externalId },
      {
        relations: {
          item: {
            components: true,
          },
        },
      },
    );

    if (!dismantleEntity) {
      this.loggerService.error("dismantleNotFound", externalId, ExchangeDismantleServiceEth.name);
      throw new NotFoundException("dismantleNotFound");
    }
    // const { components } = dismantleEntity.item;
    // const dismantleItems = items.map(item => ~~item.tokenType === 4
    //   ? Object.assign(item, {tokenId: components.filter(comp => comp.contract.address === item.token.toLowerCase() && comp.)}))
    await this.assetService.saveAssetHistory(history, items, price);

    await this.notificatorService.dismantle({
      dismantle: dismantleEntity,
      address,
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
