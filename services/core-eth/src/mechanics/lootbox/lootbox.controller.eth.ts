import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractEventType,
  ContractType,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
  IDefaultRoyaltyInfo,
  ILootboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
} from "@framework/types";

import { LootboxServiceEth } from "./lootbox.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class LootboxControllerEth {
  constructor(
    private readonly tokenServiceEth: LootboxServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.Transfer })
  public transferLootbox(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.Approval })
  public approvalLootbox(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.ApprovalForAll })
  public approvalForAllLootbox(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoLootbox(
    @Payload() event: ILogEvent<IDefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoLootbox(@Payload() event: ILogEvent<ITokenRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: ContractEventType.UnpackLootbox })
  public unpackItemLootbox(@Payload() event: ILogEvent<ILootboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.LOOTBOX, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
