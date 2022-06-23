import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractType,
  Erc998TokenEventType,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
  IErc998DefaultRoyaltyInfo,
  IErc998DropboxUnpack,
  IErc998TokenApprove,
  IErc998TokenApprovedForAll,
  IErc998TokenRoyaltyInfo,
  IErc998TokenTransfer,
} from "@framework/types";

import { Erc998DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc998DropboxControllerEth {
  constructor(
    private readonly erc998TokenServiceEth: Erc998DropboxServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.Transfer })
  public transferDropbox(@Payload() event: ILogEvent<IErc998TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.Approval })
  public approvalDropbox(@Payload() event: ILogEvent<IErc998TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.ApprovalForAll })
  public approvalForAllDropbox(
    @Payload() event: ILogEvent<IErc998TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc998DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc998TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: Erc998TokenEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: ILogEvent<IErc998DropboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_DROPBOX, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
