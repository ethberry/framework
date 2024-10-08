import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeRentableEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { RmqProviderType, SignalEventType } from "@framework/types";

@Injectable()
export class ExchangeRentServiceEth {
  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly notificatorService: NotificatorService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async rent(event: ILogEvent<IExchangeRentableEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account },
    } = event;
    const { transactionHash } = context;
    await this.eventHistoryService.updateHistory(event, context);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }
}
