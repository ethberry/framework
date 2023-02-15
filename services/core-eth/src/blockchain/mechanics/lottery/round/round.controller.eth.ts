import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
  LotteryEventType,
} from "@framework/types";

import { LotteryRoundServiceEth } from "./round.service.eth";

@Controller()
export class LotteryRoundControllerEth {
  constructor(private readonly roundServiceEth: LotteryRoundServiceEth) {}

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundStarted })
  public start(@Payload() event: ILogEvent<IRoundStartedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundFinalized })
  public finalize(@Payload() event: ILogEvent<IRoundFinalizedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.finalize(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundEnded })
  public end(@Payload() event: ILogEvent<IRoundEndedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.end(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Prize })
  public prize(@Payload() event: ILogEvent<ILotteryPrizeEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.prize(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Released })
  public release(@Payload() event: ILogEvent<ILotteryReleaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.release(event, context);
  }
}
