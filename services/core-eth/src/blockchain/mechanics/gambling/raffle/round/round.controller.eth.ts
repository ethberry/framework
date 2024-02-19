import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
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
  public raffleRoundStart(@Payload() event: ILogEvent<IRaffleRoundStartedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.raffleRoundStart(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.RoundFinalized })
  public raffleFinalize(@Payload() event: ILogEvent<IRaffleRoundFinalizedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.raffleFinalize(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.RoundEnded })
  public raffleRoundEnd(@Payload() event: ILogEvent<IRaffleRoundEndedEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.raffleRoundEnd(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.Prize })
  public prize(@Payload() event: ILogEvent<IRafflePrizeEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.rafflePrize(event, context);
  }

  @EventPattern({ contractType: ContractType.RAFFLE, eventName: RaffleEventType.Released })
  public release(@Payload() event: ILogEvent<IRaffleReleaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.roundServiceEth.release(event, context);
  }
}
