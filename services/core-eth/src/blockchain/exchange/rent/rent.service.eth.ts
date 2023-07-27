import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeLendEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class ExchangeRentServiceEth {
  constructor(
    private readonly notificatorService: NotificatorService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async rent(event: ILogEvent<IExchangeLendEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
