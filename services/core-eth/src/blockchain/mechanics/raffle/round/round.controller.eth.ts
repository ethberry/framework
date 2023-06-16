import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IRafflePrizeEvent,
  IRaffleReleaseEvent,
  IRaffleRoundEndedEvent,
  IRaffleRoundFinalizedEvent,
  IRaffleRoundStartedEvent,
  RaffleEventType,
} from "@framework/types";

import { RaffleRoundServiceEth } from "./round.service.eth";

@Controller()
export class RaffleRoundControllerEth {
  constructor(private readonly roundServiceEth: RaffleRoundServiceEth) {}

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.RoundStarted })
  public start(@Payload() event: ILogEvent<IRaffleRoundStartedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.start(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.RoundFinalized })
  public finalize(@Payload() event: ILogEvent<IRaffleRoundFinalizedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.finalize(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.RoundEnded })
  public end(@Payload() event: ILogEvent<IRaffleRoundEndedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.end(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.Prize })
  public prize(@Payload() event: ILogEvent<IRafflePrizeEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.prize(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.Released })
  public release(@Payload() event: ILogEvent<IRaffleReleaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.release(event, context);
  }
}
