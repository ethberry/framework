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
  IErc998AirdropRedeem,
  IErc998AirdropUnpack,
  IErc998DefaultRoyaltyInfo,
  IErc998TokenApprove,
  IErc998TokenApprovedForAll,
  IErc998TokenRoyaltyInfo,
  IErc998TokenTransfer,
} from "@framework/types";
import { Erc998AirdropServiceEth } from "./airdrop.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc998AirdropControllerEth {
  constructor(
    private readonly erc998AirdropServiceEth: Erc998AirdropServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.Transfer })
  public transferAirdrop(@Payload() event: ILogEvent<IErc998TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc998AirdropServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.Approval })
  public approvalAirdrop(@Payload() event: ILogEvent<IErc998TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc998AirdropServiceEth.approvalAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.ApprovalForAll })
  public approvalForAllAirdrop(
    @Payload() event: ILogEvent<IErc998TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998AirdropServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc998DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998AirdropServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc998TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc998AirdropServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: ILogEvent<IErc998AirdropRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc998AirdropServiceEth.redeem(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: Erc998TokenEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: ILogEvent<IErc998AirdropUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc998AirdropServiceEth.unpackAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_AIRDROP, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
