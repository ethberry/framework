import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { TVestingEventData } from "@framework/types";

import { LotteryTicketService } from "./ticket.service";

@Injectable()
export class LotteryTicketServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryTicketService: LotteryTicketService,
  ) {}

  public async purchase(event: ILogEvent<any>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TVestingEventData>, context: Log) {
    await Promise.resolve(context);
    this.loggerService.log(JSON.stringify(event, null, "\t"), LotteryTicketServiceEth.name);
  }
}
