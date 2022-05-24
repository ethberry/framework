import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3-core";

import { ILogEvent } from "@gemunion/nestjs-web3";
import {
  Erc721TokenEventType,
  IErc721RoleGrant,
  IErc721AirdropRedeem,
  IErc721AirdropUnpack,
  IErc721DefaultRoyaltyInfo,
  IErc721DropboxUnpack,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenMintRandom,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
} from "@framework/types";

import { Erc721TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc721TokenControllerWs {
  constructor(private readonly erc721TokenServiceWs: Erc721TokenServiceWs) {}

  @EventPattern({ eventName: Erc721TokenEventType.Transfer })
  public transferItem(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Transfer })
  public transferHero(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Transfer })
  public transferSkill(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Transfer })
  public transferAirdrop(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Transfer })
  public transferDropbox(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Approval })
  public approvalItem(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.approval(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Approval })
  public approvalHero(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.approval(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Approval })
  public approvalSkill(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.approval(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Approval })
  public approvalDropbox(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.approval(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllItem(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllHero(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllSkill(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllDropbox(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllAirdrop(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoHero(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoSkill(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoHero(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoSkill(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.MintRandom })
  public mintRandomItem(@Payload() event: ILogEvent<IErc721TokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.mintRandom(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.MintRandom })
  public mintRandomHero(@Payload() event: ILogEvent<IErc721TokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.mintRandom(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: ILogEvent<IErc721DropboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.unpack(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.Approval })
  public approvalAirdrop(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.approvalAirdrop(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: ILogEvent<IErc721AirdropRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.redeem(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: ILogEvent<IErc721AirdropUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.unpackAirdrop(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.RoleGranted })
  public roleGrant(@Payload() event: ILogEvent<IErc721RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.roleGrant(event, context);
  }

  @EventPattern({ eventName: Erc721TokenEventType.RoleRevoked })
  public roleRevoke(@Payload() event: ILogEvent<IErc721RoleGrant>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceWs.roleRevoke(event, context);
  }
}
