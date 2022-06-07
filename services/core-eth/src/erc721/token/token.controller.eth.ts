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
  IErc721RandomRequest,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenMintRandom,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
} from "@framework/types";

import { Erc721TokenServiceEth } from "./token.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc721TokenControllerEth {
  constructor(
    private readonly erc721TokenServiceEth: Erc721TokenServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.Transfer })
  public transferItem(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.Approval })
  public approvalItem(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllItem(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: Erc721TokenEventType.MintRandom })
  public mintRandomItem(@Payload() event: ILogEvent<IErc721TokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.mintRandom(event, context);
  }

  // dev test - random request
  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: "RandomRequest" })
  public randomRequest(@Payload() event: ILogEvent<IErc721RandomRequest>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.randomRequest(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
