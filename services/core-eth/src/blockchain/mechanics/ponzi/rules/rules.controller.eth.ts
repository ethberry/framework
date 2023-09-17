import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IPonziCreateEvent, IPonziUpdateEvent } from "@framework/types";
import { ContractType, PonziEventType } from "@framework/types";

import { PonziRulesServiceEth } from "./rules.service.eth";

@Controller()
export class PonziRulesControllerEth {
  constructor(private readonly ponziServiceEth: PonziRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.RuleCreated })
  public create(@Payload() event: ILogEvent<IPonziCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IPonziUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.update(event, context);
  }
}
