import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { ILevelUp } from "@framework/types";
import { ContractEventType, ContractType } from "@framework/types";

import { DiscreteServiceEth } from "./discrete.service.eth";

@Controller()
export class DiscreteControllerEth {
  constructor(public readonly discreteServiceEth: DiscreteServiceEth) {}

  @EventPattern([
    { contractType: ContractType.ERC721_TOKEN, eventName: ContractEventType.LevelUp },
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.LevelUp },
    { contractType: ContractType.ERC998_TOKEN, eventName: ContractEventType.LevelUp },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.LevelUp },
  ])
  public levelUp(@Payload() event: ILogEvent<ILevelUp>, @Ctx() context: Log): Promise<void> {
    return this.discreteServiceEth.levelUp(event, context);
  }
}
