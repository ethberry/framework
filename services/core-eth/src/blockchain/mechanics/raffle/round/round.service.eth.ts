import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log, Wallet } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import {
  IRafflePrizeEvent,
  IRaffleReleaseEvent,
  IRaffleRoundEndedEvent,
  IRaffleRoundFinalizedEvent,
  IRaffleRoundStartedEvent,
} from "@framework/types";

import { RaffleRoundService } from "./round.service";
import { EventHistoryService } from "../../../event-history/event-history.service";

@Injectable()
export class RaffleRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly raffleRoundService: RaffleRoundService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly configService: ConfigService,
    @Inject(ETHERS_SIGNER)
    private readonly ethersSignerProvider: Wallet,
  ) {}

  public async start(event: ILogEvent<IRaffleRoundStartedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, startTimestamp },
    } = event;

    await this.raffleRoundService.create({
      roundId: round,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
    });
  }

  public async finalize(event: ILogEvent<IRaffleRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    const {
      args: { round, prizeNumber },
    } = event;

    const roundEntity = await this.raffleRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, { numbers: [prizeNumber] });
    await roundEntity.save();
  }

  public async end(event: ILogEvent<IRaffleRoundEndedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);

    const {
      args: { round, endTimestamp },
    } = event;

    const roundEntity = await this.raffleRoundService.findOne({ roundId: round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(~~endTimestamp * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<IRafflePrizeEvent>, context: Log): Promise<void> {
    // TODO use it, check ticketId?
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async release(event: ILogEvent<IRaffleReleaseEvent>, context: Log): Promise<void> {
    // TODO use it somehow?
    await this.eventHistoryService.updateHistory(event, context);
  }
}
