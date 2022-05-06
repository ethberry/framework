import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, ethers } from "ethers";

import { IEvent } from "@gemunion/nestjs-web3";

import {
  Erc721AirdropStatus,
  Erc721TokenEventType,
  Erc721TokenStatus,
  IErc721AirdropRedeem,
  IErc721AirdropUnpack,
  IErc721DefaultRoyaltyInfo,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenMintRandom,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
  IErc721TokenUnpack,
  TErc721TokenEventData,
  TokenRarity,
} from "@framework/types";

import { delay } from "../../common/utils";
import { Erc721AirdropService } from "../airdrop/airdrop.service";
import { Erc721TemplateService } from "../template/template.service";
import { Erc721CollectionService } from "../collection/collection.service";
import { Erc721TokenHistoryService } from "../token-history/token-history.service";
import { Erc721TokenService } from "./token.service";

@Injectable()
export class Erc721TokenServiceWs {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc721TokenService: Erc721TokenService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly erc721AirdropService: Erc721AirdropService,
    private readonly erc721TokenHistoryService: Erc721TokenHistoryService,
    private readonly erc721CollectionService: Erc721CollectionService,
  ) {
    this.airdropAddr = configService.get<string>("DROPBOX_AIR_ADDR", "");
    this.itemsAddr = configService.get<string>("ITEMS_ADDR", "");
  }

  public async transfer(event: IEvent<IErc721TokenTransfer>): Promise<void> {
    const {
      returnValues: { from, to, tokenId },
      address,
    } = event;

    // Wait until Token will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(`Erc721Transfer@${address.toLowerCase()}: awaiting tokenId ${tokenId}`);
    await delay(1618);

    let erc721TokenEntity;
    if (address.toLowerCase() === this.airdropAddr) {
      const airdropEntity = await this.erc721AirdropService.findOne(
        { id: ~~tokenId },
        { relations: { erc721Token: true } },
      );
      erc721TokenEntity = airdropEntity?.erc721Token;
    } else {
      erc721TokenEntity = await this.erc721TokenService.getToken(tokenId, address.toLowerCase());
    }

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound@Transfer");
    }

    await this.updateHistory(event, erc721TokenEntity.id);

    Object.assign(erc721TokenEntity, {
      tokenStatus:
        from === ethers.constants.AddressZero
          ? Erc721TokenStatus.MINTED
          : to === ethers.constants.AddressZero
          ? Erc721TokenStatus.BURNED
          : erc721TokenEntity.tokenStatus,
    });

    await erc721TokenEntity.save();
  }

  public async approval(event: IEvent<IErc721TokenApprove>): Promise<void> {
    const {
      returnValues: { tokenId },
      address,
    } = event;

    const erc721TokenEntity = await this.erc721TokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async approvalAirdrop(event: IEvent<IErc721TokenApprove>): Promise<void> {
    const {
      returnValues: { tokenId },
    } = event;

    const airdropEntity = await this.erc721AirdropService.findOne(
      { id: ~~tokenId },
      { relations: { erc721Token: true } },
    );

    const erc721TokenEntity = airdropEntity?.erc721Token;

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async approvalForAll(event: IEvent<IErc721TokenApprovedForAll>): Promise<void> {
    await this.updateHistory(event);
  }

  public async defaultRoyaltyInfo(event: IEvent<IErc721DefaultRoyaltyInfo>): Promise<void> {
    const {
      address,
      returnValues: { royaltyNumerator },
    } = event;

    const erc721CollectionEntity = await this.erc721CollectionService.findOne({ address: address.toLowerCase() });

    if (!erc721CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    erc721CollectionEntity.royalty = BigNumber.from(royaltyNumerator).toNumber();

    await erc721CollectionEntity.save();

    await this.updateHistory(event);
  }

  public async tokenRoyaltyInfo(event: IEvent<IErc721TokenRoyaltyInfo>): Promise<void> {
    await this.updateHistory(event);
  }

  public async redeem(event: IEvent<IErc721AirdropRedeem>): Promise<void> {
    const {
      returnValues: { from, tokenId, templateId },
    } = event;

    const erc721TemplateEntity = await this.erc721TemplateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: erc721TemplateEntity.attributes,
      owner: from.toLowerCase(),
      rarity: TokenRarity.UNKNOWN,
      erc721Template: erc721TemplateEntity,
    });

    // Update Airdrop
    await this.erc721AirdropService.update(
      { id: ~~tokenId },
      { airdropStatus: Erc721AirdropStatus.REDEEMED, erc721Token: erc721TokenEntity },
    );

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async unpack(event: IEvent<IErc721TokenUnpack>): Promise<void> {
    const {
      returnValues: { collection, tokenId },
      address,
    } = event;

    const erc721CollectionEntity = await this.erc721CollectionService.findOne({ address: collection.toLowerCase() });

    if (!erc721CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async unpackAirdrop(event: IEvent<IErc721AirdropUnpack>): Promise<void> {
    const {
      returnValues: { tokenId, airdropId },
    } = event;

    const erc721TokenEntity = await this.erc721TokenService.findOne({ id: ~~airdropId });

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    // Update Airdrop status
    await this.erc721AirdropService.update({ id: ~~tokenId }, { airdropStatus: Erc721AirdropStatus.UNPACKED });

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  public async mintRandom(event: IEvent<IErc721TokenMintRandom>): Promise<void> {
    const {
      returnValues: { to, tokenId, templateId, rarity, dropboxId },
    } = event;

    const erc721TemplateEntity = await this.erc721TemplateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721DropboxEntity = await this.erc721TokenService.findOne({ id: ~~dropboxId });

    if (!erc721DropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: erc721TemplateEntity.attributes,
      owner: to.toLowerCase(),
      erc721Template: erc721TemplateEntity,
      erc721Token: erc721DropboxEntity,
      rarity: Object.values(TokenRarity)[~~rarity],
    });

    await this.updateHistory(event, erc721TokenEntity.id);
  }

  private async updateHistory(event: IEvent<TErc721TokenEventData>, erc721TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"));

    const { returnValues, event: eventType, transactionHash, address } = event;

    return await this.erc721TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: eventType as Erc721TokenEventType,
      eventData: returnValues,
      // ApprovedForAll has no tokenId
      erc721TokenId: erc721TokenId || null,
    });
  }
}
