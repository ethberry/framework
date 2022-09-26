import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { Log } from "@ethersproject/abstract-provider";
import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import {
  ILotteryPrizeEvent,
  ILotteryRandomRequestEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
  LotteryEventType,
  TLotteryEventData,
} from "@framework/types";

import { LotteryHistoryService } from "../history/history.service";
import { LotteryRoundService } from "./round.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { callRandom, getLotteryNumbers } from "../../../../common/utils";

@Injectable()
export class LotteryRoundServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly lotteryRoundService: LotteryRoundService,
    private readonly lotteryHistoryService: LotteryHistoryService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
  ) {}

  public async start(event: ILogEvent<IRoundStartedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    const {
      args: { round, startTimestamp },
    } = event;

    await this.lotteryRoundService.create({
      roundId: round,
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
    });
  }

  public async finalize(event: ILogEvent<IRoundFinalizedEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
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
    await this.updateHistory(event, context);

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
    await this.updateHistory(event, context);
  }

  public async release(event: ILogEvent<ILotteryReleaseEvent>, context: Log): Promise<void> {
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

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }

  public async randomRequest(event: ILogEvent<ILotteryRandomRequestEvent>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
    // DEV ONLY
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    if (nodeEnv === "development") {
      const {
        args: { requestId },
      } = event;
      const { address } = context;
      const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
      await callRandom(vrfAddr, address, requestId, this.signer);
    }
  }
}
