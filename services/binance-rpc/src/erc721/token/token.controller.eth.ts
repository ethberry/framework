import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc721TokenEventType,
  IErc721AirdropRedeem,
  IErc721AirdropUnpack,
  IErc721DefaultRoyaltyInfo,
  IErc721DropboxUnpack,
  IErc721RandomRequest,
  IErc721RoleChange,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenMintRandom,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
} from "@framework/types";

import { Erc721TokenServiceEth } from "./token.service.eth";

@Controller()
export class Erc721TokenControllerEth {
  constructor(private readonly erc721TokenServiceEth: Erc721TokenServiceEth) {}

  // TODO add more events
  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.Transfer })
  public transferItem(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Transfer })
  public transferAirdrop(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Transfer })
  public transferDropbox(@Payload() event: ILogEvent<IErc721TokenTransfer>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.transfer(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.Approval })
  public approvalItem(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Approval })
  public approvalDropbox(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approval(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Approval })
  public approvalAirdrop(@Payload() event: ILogEvent<IErc721TokenApprove>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.approvalAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllItem(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllDropbox(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllAirdrop(
    @Payload() event: ILogEvent<IErc721TokenApprovedForAll>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.approvalForAll(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721DefaultRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.defaultRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoItem(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(
    @Payload() event: ILogEvent<IErc721TokenRoyaltyInfo>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.erc721TokenServiceEth.tokenRoyaltyInfo(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.MintRandom })
  public mintRandomItem(@Payload() event: ILogEvent<IErc721TokenMintRandom>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.mintRandom(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: ILogEvent<IErc721DropboxUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.unpack(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: ILogEvent<IErc721AirdropRedeem>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.redeem(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: ILogEvent<IErc721AirdropUnpack>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.unpackAirdrop(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.RoleGranted })
  public roleGrantItem(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleGrant(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.RoleGranted })
  public roleGrantDropbox(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleGrant(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.RoleGranted })
  public roleGrantAirdrop(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleGrant(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: Erc721TokenEventType.RoleRevoked })
  public roleRevokeItem(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleRevoke(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.RoleRevoked })
  public roleRevokeDropbox(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleRevoke(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.RoleRevoked })
  public roleRevokeAirdrop(@Payload() event: ILogEvent<IErc721RoleChange>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.roleRevoke(event, context);
  }

  // dev test - random request
  @EventPattern({ contractType: ContractType.ERC721_COLLECTION, eventName: "RandomRequest" })
  public randomRequest(@Payload() event: ILogEvent<IErc721RandomRequest>, @Ctx() context: Log): Promise<void> {
    return this.erc721TokenServiceEth.randomRequest(event, context);
  }
}
