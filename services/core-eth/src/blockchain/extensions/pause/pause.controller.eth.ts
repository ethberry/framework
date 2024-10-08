import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ContractType, IPausedEvent, PausableEventType } from "@framework/types";

import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([
    { contractType: ContractType.MYSTERY, eventName: PausableEventType.Paused },
    { contractType: ContractType.RAFFLE, eventName: PausableEventType.Paused },
    { contractType: ContractType.LOTTERY, eventName: PausableEventType.Paused },
    { contractType: ContractType.EXCHANGE, eventName: PausableEventType.Paused },
    { contractType: ContractType.STAKING, eventName: PausableEventType.Paused },
    { contractType: ContractType.PONZI, eventName: PausableEventType.Paused },
    { contractType: ContractType.WAIT_LIST, eventName: PausableEventType.Paused },
  ])
  public pause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }

  @EventPattern([
    { contractType: ContractType.MYSTERY, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.LOTTERY, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.RAFFLE, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.EXCHANGE, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.STAKING, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.PONZI, eventName: PausableEventType.Unpaused },
    { contractType: ContractType.WAIT_LIST, eventName: PausableEventType.Unpaused },
  ])
  public unpause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.unpause(event, context);
  }
}
