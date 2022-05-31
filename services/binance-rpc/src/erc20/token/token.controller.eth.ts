import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractType,
  Erc20TokenEventType,
  IAccessControlRoleAdminChanged,
  IErc20RoleGrant,
  IErc20TokenApprove,
  IErc20TokenSnapshot,
  IErc20TokenTransfer,
} from "@framework/types";

import { Erc20TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc20TokenControllerEth {
  constructor(private readonly erc20TokenServiceEth: Erc20TokenServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: Erc20TokenEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IErc20TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: Erc20TokenEventType.Approval })
  public approval(@Payload() event: ILogEvent<IErc20TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: Erc20TokenEventType.Snapshot })
  public snapshot(@Payload() event: ILogEvent<IErc20TokenSnapshot>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.snapshot(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.roleGrant(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc20RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.roleRevoke(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC20_CONTRACT, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.erc20TokenServiceEth.roleAdmin(event, context);
  }
}
