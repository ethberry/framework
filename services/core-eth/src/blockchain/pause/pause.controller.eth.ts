import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, ContractType, IPaused } from "@framework/types";

import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.Paused },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.Paused },
    { contractType: ContractType.EXCHANGE, eventName: ContractEventType.Paused },
    { contractType: ContractType.STAKING, eventName: ContractEventType.Paused },
    { contractType: ContractType.PYRAMID, eventName: ContractEventType.Paused },
    { contractType: ContractType.MYSTERY, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.EXCHANGE, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.STAKING, eventName: ContractEventType.Unpaused },
    { contractType: ContractType.PYRAMID, eventName: ContractEventType.Unpaused },
  ])
  public pause(@Payload() event: ILogEvent<IPaused>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }
}
