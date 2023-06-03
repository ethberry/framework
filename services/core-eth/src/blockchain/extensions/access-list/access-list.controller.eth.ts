import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessListEventType,
  ContractType,
  IBlacklistedEvent,
  IUnBlacklistedEvent,
  IUnWhitelistedEvent,
  IWhitelistedEvent,
} from "@framework/types";

import { AccessListServiceEth } from "./access-list.service.eth";

@Controller()
export class AccessListControllerEth {
  constructor(private readonly accessListServiceEth: AccessListServiceEth) {}

  @EventPattern([
    { contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.Blacklisted },
    { contractType: ContractType.ERC721_TOKEN, eventName: AccessListEventType.Blacklisted },
    { contractType: ContractType.ERC998_TOKEN, eventName: AccessListEventType.Blacklisted },
    { contractType: ContractType.ERC1155_TOKEN, eventName: AccessListEventType.Blacklisted },
    { contractType: ContractType.MYSTERY, eventName: AccessListEventType.Blacklisted },
  ])
  public blacklisted(@Payload() event: ILogEvent<IBlacklistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.blacklisted(event, context);
  }

  @EventPattern([
    { contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.UnBlacklisted },
    { contractType: ContractType.ERC721_TOKEN, eventName: AccessListEventType.UnBlacklisted },
    { contractType: ContractType.ERC998_TOKEN, eventName: AccessListEventType.UnBlacklisted },
    { contractType: ContractType.ERC1155_TOKEN, eventName: AccessListEventType.UnBlacklisted },
    { contractType: ContractType.MYSTERY, eventName: AccessListEventType.UnBlacklisted },
  ])
  public unBlacklisted(@Payload() event: ILogEvent<IUnBlacklistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unBlacklisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.Whitelisted })
  public whitelisted(@Payload() event: ILogEvent<IWhitelistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.whitelisted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessListEventType.UnWhitelisted })
  public unWhitelisted(@Payload() event: ILogEvent<IUnWhitelistedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessListServiceEth.unWhitelisted(event, context);
  }
}
