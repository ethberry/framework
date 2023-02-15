import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { Log } from "@ethersproject/abstract-provider";
import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import {
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
} from "@framework/types";

import { LotteryRoundService } from "./round.service";
import { getLotteryNumbers } from "../../../../common/utils";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly configService: ConfigService,
    @Inject(ETHERS_SIGNER)
    private readonly ethersSignerProvider: Wallet,
  ) {}

  public async start(event: ILogEvent<IRoundStartedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, startTimestamp },
    } = event;

    await this.lotteryRoundService.create({
      roundId: round,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
    });
  }

  public async finalize(event: ILogEvent<IRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, winValues },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { numbers: getLotteryNumbers(winValues) });
    await roundEntity.save();
  }

  public async end(event: ILogEvent<IRoundEndedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { round, endTimestamp },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(~~endTimestamp * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<ILotteryPrizeEvent>, context: Log): Promise<void> {
    // TODO use it, check ticketId?
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async release(event: ILogEvent<ILotteryReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
