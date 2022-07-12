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
  IAirdropRedeem,
  IAirdropUnpack,
  IDefaultRoyaltyInfo,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
} from "@framework/types";
import { AirdropServiceEth } from "./airdrop.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class AirdropControllerEth {
  constructor(
    private readonly erc721AirdropServiceEth: AirdropServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.Transfer })
  public transferAirdrop(@Payload() event: ILogEvent<ITokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.Approval })
  public approvalAirdrop(@Payload() event: ILogEvent<ITokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.approvalAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.ApprovalForAll })
  public approvalForAllAirdrop(@Payload() event: ILogEvent<ITokenApprovedForAll>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IDefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721AirdropServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(@Payload() event: ILogEvent<ITokenRoyaltyInfo>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: ILogEvent<IAirdropRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.redeem(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: ContractEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: ILogEvent<IAirdropUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.unpackAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.AIRDROP, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
