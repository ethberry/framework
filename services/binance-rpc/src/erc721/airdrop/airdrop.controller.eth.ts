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
  IErc721AirdropRedeem,
  IErc721AirdropUnpack,
  IErc721DefaultRoyaltyInfo,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
} from "@framework/types";
import { Erc721AirdropServiceEth } from "./airdrop.service.eth";
import { AccessControlServiceEth } from "../../blockchain/access-control/access-control.service.eth";

@Controller()
export class Erc721AirdropControllerEth {
  constructor(
    private readonly erc721AirdropServiceEth: Erc721AirdropServiceEth,
    private readonly accessControlServiceEth: AccessControlServiceEth,
  ) {}

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Transfer })
  public transferAirdrop(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Approval })
  public approvalAirdrop(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.approvalAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllAirdrop(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721AirdropServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721AirdropServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721AirdropServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: ILogEvent<IErc721AirdropRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.redeem(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: ILogEvent<IErc721AirdropUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721AirdropServiceEth.unpackAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: AccessControlEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IAccessControlRoleGranted>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleGranted(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: AccessControlEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IAccessControlRoleRevoked>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleRevoked(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: AccessControlEventType.RoleAdminChanged })
  public roleAdmin(@Payload() event: ILogEvent<IAccessControlRoleAdminChanged>, @Ctx() context: Log): Promise<void> {
    return this.accessControlServiceEth.roleAdminChanged(event, context);
  }
}
