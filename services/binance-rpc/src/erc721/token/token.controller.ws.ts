import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc721TokenEventType,
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

import { ContractType } from "../../common/interfaces";
import { Erc721TokenServiceWs } from "./token.service.ws";

@Controller()
export class Erc721TokenControllerWs {
  constructor(private readonly erc721TokenServiceWs: Erc721TokenServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.Transfer })
  public transferItem(@Payload() event: IEvent<IErc721TokenTransfer>): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.Transfer })
  public transferHero(@Payload() event: IEvent<IErc721TokenTransfer>): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_SKILL, eventName: Erc721TokenEventType.Transfer })
  public transferSkill(@Payload() event: IEvent<IErc721TokenTransfer>): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Transfer })
  public transferAirdrop(@Payload() event: IEvent<IErc721TokenTransfer>): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Transfer })
  public transferDropbox(@Payload() event: IEvent<IErc721TokenTransfer>): Promise<void> {
    return this.erc721TokenServiceWs.transfer(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.Approval })
  public approvalItem(@Payload() event: IEvent<IErc721TokenApprove>): Promise<void> {
    return this.erc721TokenServiceWs.approval(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.Approval })
  public approvalHero(@Payload() event: IEvent<IErc721TokenApprove>): Promise<void> {
    return this.erc721TokenServiceWs.approval(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_SKILL, eventName: Erc721TokenEventType.Approval })
  public approvalSkill(@Payload() event: IEvent<IErc721TokenApprove>): Promise<void> {
    return this.erc721TokenServiceWs.approval(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.Approval })
  public approvalDropbox(@Payload() event: IEvent<IErc721TokenApprove>): Promise<void> {
    return this.erc721TokenServiceWs.approval(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllItem(@Payload() event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllHero(@Payload() event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_SKILL, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllSkill(@Payload() event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllDropbox(@Payload() event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.ApprovalForAll })
  public approvalForAllAirdrop(@Payload() event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    return this.erc721TokenServiceWs.approvalForAll(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoItem(@Payload() event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoHero(@Payload() event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_SKILL, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoSkill(@Payload() event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoDropbox(@Payload() event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.DefaultRoyaltyInfo })
  public defaultRoyaltyInfoAirdrop(@Payload() event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.defaultRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoItem(@Payload() event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoHero(@Payload() event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_SKILL, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoSkill(@Payload() event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoDropbox(@Payload() event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.TokenRoyaltyInfo })
  public tokenRoyaltyInfoAirdrop(@Payload() event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    return this.erc721TokenServiceWs.tokenRoyaltyInfo(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_ITEMS, eventName: Erc721TokenEventType.MintRandom })
  public mintRandomItem(@Payload() event: IEvent<IErc721TokenMintRandom>): Promise<void> {
    return this.erc721TokenServiceWs.mintRandom(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_HERO, eventName: Erc721TokenEventType.MintRandom })
  public mintRandomHero(@Payload() event: IEvent<IErc721TokenMintRandom>): Promise<void> {
    return this.erc721TokenServiceWs.mintRandom(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_DROPBOX, eventName: Erc721TokenEventType.UnpackDropbox })
  public unpackItemDropbox(@Payload() event: IEvent<IErc721DropboxUnpack>): Promise<void> {
    return this.erc721TokenServiceWs.unpack(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.Approval })
  public approvalAirdrop(@Payload() event: IEvent<IErc721TokenApprove>): Promise<void> {
    return this.erc721TokenServiceWs.approvalAirdrop(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.RedeemAirdrop })
  public redeemAirdrop(@Payload() event: IEvent<IErc721AirdropRedeem>): Promise<void> {
    return this.erc721TokenServiceWs.redeem(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_AIRDROP, eventName: Erc721TokenEventType.UnpackAirdrop })
  public unpackAirdrop(@Payload() event: IEvent<IErc721AirdropUnpack>): Promise<void> {
    return this.erc721TokenServiceWs.unpackAirdrop(event);
  }
}
