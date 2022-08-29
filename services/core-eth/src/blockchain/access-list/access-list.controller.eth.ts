import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { AccessListEventType, ContractType, IBlacklisted, IUnBlacklisted } from "@framework/types";

import { AccessListServiceEth } from "./access-list.service.eth";

@Controller()
export class AccessListControllerEth {
  constructor(private readonly accessListServiceEth: AccessListServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.Blacklisted })
  public blacklisted(@Payload() event: ILogEvent<IBlacklisted>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.blacklisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.UnBlacklisted })
  public unBlacklisted(@Payload() event: ILogEvent<IUnBlacklisted>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unBlacklisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.Whitelisted })
  public whitelisted(@Payload() event: ILogEvent<IBlacklisted>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.whitelisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.UnWhitelisted })
  public unWhitelisted(@Payload() event: ILogEvent<IUnBlacklisted>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unWhitelisted(event, context);
  }
}
