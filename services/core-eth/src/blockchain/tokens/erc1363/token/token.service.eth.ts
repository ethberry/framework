import { Injectable } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IErc1363TransferReceivedEvent } from "@framework/types";

import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class Erc1363TokenServiceEth {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  public async transferReceived(event: ILogEvent<IErc1363TransferReceivedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
