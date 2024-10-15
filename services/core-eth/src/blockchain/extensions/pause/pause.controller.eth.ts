import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IPausedEvent, PausableEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { PauseServiceEth } from "./pause.service.eth";

@Controller()
export class PauseControllerEth {
  constructor(private readonly pauseServiceEth: PauseServiceEth) {}

  @EventPattern([{ contractType: ContractType.PAUSE, eventName: PausableEventType.Paused }])
  public pause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.pause(event, context);
  }

  @EventPattern([{ contractType: ContractType.PAUSE, eventName: PausableEventType.Unpaused }])
  public unpause(@Payload() event: ILogEvent<IPausedEvent>, @Ctx() context: Log): Promise<void> {
    return this.pauseServiceEth.unpause(event, context);
  }
}
