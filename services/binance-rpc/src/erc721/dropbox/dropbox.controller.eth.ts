import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlEventType,
  ContractType,
  Erc721TokenEventType,
  IAccessControlRoleAdminChanged,
  IAccessControlRoleGranted,
  IAccessControlRoleRevoked,
  IErc721DefaultRoyaltyInfo,
  IErc721DropboxUnpack,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
} from "@framework/types";

import { Erc721DropboxServiceEth } from "./dropbox.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc721DropboxControllerEth {
  constructor(
    private readonly erc721TokenServiceEth: Erc721DropboxServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Transfer })
  public transferDropbox(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Approval })
  public approvalDropbox(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllDropbox(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: ILogEvent<IErc721DropboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
