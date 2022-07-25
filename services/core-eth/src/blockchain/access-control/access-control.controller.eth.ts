import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractType,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
} from "@framework/types";

import { AccessControlServiceEth } from "./access-control.service.eth";

@Controller()
export class AccessControlControllerEth {
  constructor(private readonly accessControlServiceEth: AccessControlServiceEth) {}

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleGranted })
  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleGranted })
  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleGranted })
  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleGranted })
  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleRevoked })
  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleAdminChanged })
  @EventPattern({ contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  @EventPattern({ contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
