import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractType, LotteryEventType } from "@framework/types";
import type {
  ILotteryPrizeEvent,
  ILotteryReleaseEvent,
  IRoundEndedEvent,
  IRoundFinalizedEvent,
  IRoundStartedEvent,
} from "@framework/types";

import { LotteryRoundServiceEth } from "./round.service.eth";

@Controller()
export class LotteryRoundControllerEth {
  constructor(private readonly roundServiceEth: LotteryRoundServiceEth) {}

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundStarted })
  public lotteryRoundStart(@Payload() event: ILogEvent<IRoundStartedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.lotteryRoundStart(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundFinalized })
  public lotteryFinalize(@Payload() event: ILogEvent<IRoundFinalizedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.lotteryFinalize(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.RoundEnded })
  public lotteryRoundEnd(@Payload() event: ILogEvent<IRoundEndedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.lotteryRoundEnd(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Prize })
  public lotteryPrize(@Payload() event: ILogEvent<ILotteryPrizeEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.lotteryPrize(event, context);
  }

  @EventPattern({ contractType: ContractType.LOTTERY, eventName: LotteryEventType.Released })
  public release(@Payload() event: ILogEvent<ILotteryReleaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.release(event, context);
  }
}
