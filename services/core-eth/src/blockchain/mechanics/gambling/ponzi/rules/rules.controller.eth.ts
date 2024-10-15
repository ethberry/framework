import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IPonziCreateEvent, IPonziUpdateEvent } from "@framework/types";
import { PonziEventType } from "@framework/types";

import { PonziRulesServiceEth } from "./rules.service.eth";
import { ContractType } from "../../../../../utils/contract-type";

@Controller()
export class PonziRulesControllerEth {
  constructor(private readonly ponziServiceEth: PonziRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.RuleCreatedP })
  public create(@Payload() event: ILogEvent<IPonziCreateEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.PONZI, eventName: PonziEventType.RuleUpdated })
  public update(@Payload() event: ILogEvent<IPonziUpdateEvent>, @Ctx() context: Log): Promise<void> {
    return this.ponziServiceEth.update(event, context);
  }
}
