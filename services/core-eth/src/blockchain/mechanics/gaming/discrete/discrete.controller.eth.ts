import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ContractType, DiscreteEventType, ILevelUp } from "@framework/types";

import { DiscreteServiceEth } from "./discrete.service.eth";

@Controller()
export class DiscreteControllerEth {
  constructor(public readonly discreteServiceEth: DiscreteServiceEth) {}

  @EventPattern([
    { contractType: ContractType.ERC721_TOKEN, eventName: DiscreteEventType.LevelUp },
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: DiscreteEventType.LevelUp },
    { contractType: ContractType.ERC998_TOKEN, eventName: DiscreteEventType.LevelUp },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: DiscreteEventType.LevelUp },
  ])
  public levelUp(@Payload() event: ILogEvent<ILevelUp>, @Ctx() context: Log): Promise<void> {
    return this.discreteServiceEth.levelUp(event, context);
  }
}
