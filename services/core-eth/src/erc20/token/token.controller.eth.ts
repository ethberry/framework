import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessListEventType,
  ContractEventType,
  ContractType,
  IBlacklisted,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
  IUnBlacklisted,
} from "@framework/types";

import { Erc20TokenServiceEth } from "./token.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";
import { AccessListServiceEth } from "../../blockchain/access-list/access-list.service.eth";

@Controller()
export class Erc20TokenControllerEth {
  constructor(
    private readonly erc20TokenServiceEth: Erc20TokenServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
    private readonly accessListServiceEth: AccessListServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: ContractEventType.Snapshot })
  public snapshot(@Payload() event: ILogEvent<IErc20TokenSnapshot>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.snapshot(event, context);
  }

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
