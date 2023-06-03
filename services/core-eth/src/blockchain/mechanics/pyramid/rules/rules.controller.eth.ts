import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, IPyramidCreateEvent, IPyramidUpdateEvent, PyramidEventType } from "@framework/types";

import { PyramidRulesServiceEth } from "./rules.service.eth";

@Controller()
export class PyramidRulesControllerEth {
  constructor(private readonly pyramidServiceEth: PyramidRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.RuleCreated })
  public create(@Payload() event: ILogEvent<IPyramidCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.PYRAMID, eventName: PyramidEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IPyramidUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.pyramidServiceEth.update(event, context);
  }
}
