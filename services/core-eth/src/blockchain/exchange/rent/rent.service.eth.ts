import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeLendEvent } from "@framework/types";

import { EventHistoryService } from "../../event-history/event-history.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";

@Injectable()
export class ExchangeRentServiceEth {
  constructor(
    private readonly notificatorService: NotificatorService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async rent(event: ILogEvent<IExchangeLendEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, expires, externalId, item, price },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    this.notificatorService.rent({ from, to, expires, externalId, item, price });
  }
}
