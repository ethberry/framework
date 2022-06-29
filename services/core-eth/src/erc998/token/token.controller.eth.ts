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
  IErc998RandomRequest,
  IUniTokenApprove,
  IUniTokenApprovedForAll,
  IUniTokenMintRandom,
  IUniTokenRoyaltyInfo,
  IUniTokenTransfer,
} from "@framework/types";

import { Erc998TokenServiceEth } from "./token.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc998TokenControllerEth {
  constructor(
    private readonly erc998TokenServiceEth: Erc998TokenServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.Transfer })
  public transfer(@Payload() event: ILogEvent<IUniTokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.Approval })
  public approval(@Payload() event: ILogEvent<IUniTokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.ApprovalForAll })
  public approvalForAll(@Payload() event: ILogEvent<IUniTokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfo(
    @Payload() event: ILogEvent<IErc998DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfo(@Payload() event: ILogEvent<IUniTokenRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: Erc998TokenEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<IUniTokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.mintRandom(event, context);
  }

  // dev test - random request
  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: "RandomRequest" })
  public randomRequest(@Payload() event: ILogEvent<IErc998RandomRequest>, @Ctx() context: Log): Promise<void> {
    return this.erc998TokenServiceEth.randomRequest(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_TOKEN, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
