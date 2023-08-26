import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractType,
  Erc4907EventType,
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IErc4907UpdateUserEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";

import { AccessControlServiceEth } from "./access-control.service.eth";

@Controller()
export class AccessControlControllerEth {
  constructor(private readonly accessControlServiceEth: AccessControlServiceEth) {}

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: AccessControlEventType.RoleGranted,
    },
    {
      contractType: ContractType.EXCHANGE,
      eventName: AccessControlEventType.RoleGranted,
    },
    {
      contractType: ContractType.MYSTERY,
      eventName: AccessControlEventType.RoleGranted,
    },
    { contractType: ContractType.STAKING, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.PONZI, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.LOTTERY, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.RAFFLE, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.WRAPPER, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: AccessControlEventType.RoleGranted },
    { contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleGranted },
  ])
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGrantedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: AccessControlEventType.RoleRevoked,
    },
    {
      contractType: ContractType.EXCHANGE,
      eventName: AccessControlEventType.RoleRevoked,
    },
    {
      contractType: ContractType.MYSTERY,
      eventName: AccessControlEventType.RoleRevoked,
    },
    { contractType: ContractType.STAKING, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.PONZI, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.WRAPPER, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.LOTTERY, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.RAFFLE, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: AccessControlEventType.RoleRevoked },
    { contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleRevoked },
  ])
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevokedEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.CONTRACT_MANAGER,
      eventName: AccessControlEventType.RoleAdminChanged,
    },
    {
      contractType: ContractType.EXCHANGE,
      eventName: AccessControlEventType.RoleAdminChanged,
    },
    {
      contractType: ContractType.MYSTERY,
      eventName: AccessControlEventType.RoleAdminChanged,
    },
    { contractType: ContractType.STAKING, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.PONZI, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.WRAPPER, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.LOTTERY, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.RAFFLE, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC1155_TOKEN, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: AccessControlEventType.RoleAdminChanged },
    { contractType: ContractType.ERC20_TOKEN, eventName: AccessControlEventType.RoleAdminChanged },
  ])
  public roleAdmin(
    @Payload() event: ILogEvent<IAccessControlRoleAdminChangedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.VESTING,
      eventName: AccessControlEventType.OwnershipTransferred,
    },
  ])
  public ownership(@Payload() event: ILogEvent<IOwnershipTransferredEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.ownershipChanged(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.ERC721_TOKEN,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC721_TOKEN_RANDOM,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC998_TOKEN,
      eventName: Erc4907EventType.UpdateUser,
    },
    {
      contractType: ContractType.ERC998_TOKEN_RANDOM,
      eventName: Erc4907EventType.UpdateUser,
    },
  ])
  public updateUser(@Payload() event: ILogEvent<IErc4907UpdateUserEvent>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.updateUser(event, context);
  }
}
