import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, ContractType, IPaused } from "@framework/types";

import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([
    { contractType: ContractType.MYSTERYBOX, eventName: ContractEventType.Paused },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.Paused },
    { contractType: ContractType.EXCHANGE, eventName: ContractEventType.Paused },
    { contractType: ContractType.STAKING, eventName: ContractEventType.Paused },
    { contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.Paused },
    { contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.Paused },
  ])
  public pause(@Payload() event: ILogEvent<IPaused>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }
}
