import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ILotteryPrize,
  ILotteryRelease,
  IRoundEnded,
  IRoundStarted,
  LotteryEventType,
  TLotteryEventData,
} from "@framework/types";

import { LotteryHistoryService } from "../history/history.service";
import { LotteryRoundService } from "./round.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly lotteryHistoryService: LotteryHistoryService,
    private readonly contractService: ContractService,
  ) {}

  public async start(event: ILogEvent<IRoundStarted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const {
      args: { round, startTimestamp },
    } = event;

    const roundEntity = await this.lotteryRoundService.create({
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
    });

    // TODO use round_id ???
    if (roundEntity.id !== ~~round) {
      throw new NotFoundException("roundIsWrong");
    }
  }

  public async end(event: ILogEvent<IRoundEnded>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const {
      args: { round, endTimestamp },
    } = event;

    const roundEntity = await this.lotteryRoundService.findOne({ id: ~~round });

    if (!roundEntity) {
      throw new NotFoundException("roundNotFound");
    }

    Object.assign(roundEntity, {
      endTimestamp: new Date(~~endTimestamp * 1000).toISOString(),
    });

    await roundEntity.save();
  }

  public async prize(event: ILogEvent<ILotteryPrize>, context: Log): Promise<void> {
    // TODO use it, check ticketId?
    await this.updateHistory(event, context);
  }

  public async release(event: ILogEvent<ILotteryRelease>, context: Log): Promise<void> {
    // TODO use it somehow?
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TLotteryEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), LotteryRoundServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.lotteryHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as LotteryEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(
      address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
