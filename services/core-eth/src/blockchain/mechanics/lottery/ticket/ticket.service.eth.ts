import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ILotteryPurchaseEvent, LotteryEventType, TLotteryEventData } from "@framework/types";

import { LotteryTicketService } from "./ticket.service";
import { LotteryHistoryService } from "../history/history.service";
import { LotteryRoundService } from "../round/round.service";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class LotteryTicketServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryTicketService: LotteryTicketService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly lotteryHistoryService: LotteryHistoryService,
    private readonly tokenService: TokenService,
  ) {}

  public async purchase(event: ILogEvent<ILotteryPurchaseEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const {
      args: { account, price, round, numbers },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    await this.lotteryTicketService.create({
      account,
      numbers,
      amount: price,
      roundId: roundEntity.id,
      tokenId: 801001,
    });
  }

  private async updateHistory(event: ILogEvent<TLotteryEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), LotteryTicketServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address } = context;

    await this.lotteryHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as LotteryEventType,
      eventData: args,
    });
  }
}
