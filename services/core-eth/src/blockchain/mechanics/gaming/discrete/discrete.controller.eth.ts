import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { DiscreteEventType, ILevelUp } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { DiscreteServiceEth } from "./discrete.service.eth";

@Controller()
export class DiscreteControllerEth {
  constructor(public readonly discreteServiceEth: DiscreteServiceEth) {}

  @EventPattern([{ contractType: ContractType.DESCRETE, eventName: DiscreteEventType.LevelUp }])
  public levelUp(@Payload() event: ILogEvent<ILevelUp>, @Ctx() context: Log): Promise<void> {
    return this.discreteServiceEth.levelUp(event, context);
  }
}
