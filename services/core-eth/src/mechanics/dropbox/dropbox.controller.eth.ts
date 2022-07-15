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
  IDropboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
} from "@framework/types";

import { DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class DropboxControllerEth {
  constructor(
    private readonly tokenServiceEth: DropboxServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.Transfer })
  public transferDropbox(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.Approval })
  public approvalDropbox(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.ApprovalForAll })
  public approvalForAllDropbox(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IDefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.tokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(@Payload() event: ILogEvent<ITokenRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: ContractEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: ILogEvent<IDropboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.tokenServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.DROPBOX, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
