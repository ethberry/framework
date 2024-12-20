import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractEventType, ContractType, IPausedEvent } from "@framework/types";

import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.Paused },
    { contractType: ContractType.RAFFLE, eventName: ContractEventType.Paused },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.Paused },
    { contractType: ContractType.EXCHANGE, eventName: ContractEventType.Paused },
    { contractType: ContractType.STAKING, eventName: ContractEventType.Paused },
    { contractType: ContractType.PONZI, eventName: ContractEventType.Paused },
    { contractType: ContractType.WAIT_LIST, eventName: ContractEventType.Paused },
  ])
  public pause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }

  @EventPattern([
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.RAFFLE, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.EXCHANGE, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.STAKING, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.PONZI, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.WAIT_LIST, eventName: ContractEventType.Unpaused },
  ])
  public unpause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.unpause(event, context);
  }
}
