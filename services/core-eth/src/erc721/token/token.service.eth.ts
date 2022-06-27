import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  Erc721TokenEventType,
  UniTokenStatus,
  IErc721AirdropRedeem,
  IErc721DefaultRoyaltyInfo,
  IErc721RandomRequest,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenMintRandom,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
  TErc721TokenEventData,
  TokenRarity,
} from "@framework/types";

import { delay } from "../../common/utils";
import { Erc721TemplateService } from "../template/template.service";
import { Erc721CollectionService } from "../collection/collection.service";
import { Erc721TokenHistoryService } from "./token-history/token-history.service";
import { Erc721TokenService } from "./token.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc721TokenServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc721TokenService: Erc721TokenService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly erc721TokenHistoryService: Erc721TokenHistoryService,
    private readonly erc721CollectionService: Erc721CollectionService,
  ) {
    this.airdropAddr = configService.get<string>("ERC721_AIRDROP_ADDR", "");
    this.itemsAddr = configService.get<string>("ERC721_ITEM_ADDR", "");
  }

  public async transfer(event: ILogEvent<IErc721TokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;

    // Wait until Token will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(
      `Erc721Transfer@${context.address.toLowerCase()}: awaiting tokenId ${tokenId}`,
      Erc721TokenServiceEth.name,
    );
    await delay(1618);

    const erc721TokenEntity = await this.erc721TokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.erc721Template
        ? (erc721TokenEntity.erc721Template.instanceCount += 1)
        : (erc721TokenEntity.erc721Dropbox.erc721Template.instanceCount += 1);
      erc721TokenEntity.tokenStatus = UniTokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // erc721TokenEntity.erc721Template.instanceCount -= 1;
      erc721TokenEntity.tokenStatus = UniTokenStatus.BURNED;
    }

    erc721TokenEntity.owner = to;

    await erc721TokenEntity.save();

    // need to save updates in nested entities too
    erc721TokenEntity.erc721Template
      ? await erc721TokenEntity.erc721Template.save()
      : await erc721TokenEntity.erc721Dropbox.erc721Template.save();
  }

  public async approval(event: ILogEvent<IErc721TokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const erc721TokenEntity = await this.erc721TokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<IErc721TokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async defaultRoyaltyInfo(event: ILogEvent<IErc721DefaultRoyaltyInfo>, context: Log): Promise<void> {
    const {
      args: { royaltyNumerator },
    } = event;

    const erc721CollectionEntity = await this.erc721CollectionService.findOne({
      address: context.address.toLowerCase(),
    });

    if (!erc721CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    erc721CollectionEntity.royalty = BigNumber.from(royaltyNumerator).toNumber();

    await erc721CollectionEntity.save();

    await this.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<IErc721TokenRoyaltyInfo>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async redeem(event: ILogEvent<IErc721AirdropRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const erc721TemplateEntity = await this.erc721TemplateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: erc721TemplateEntity.attributes,
      owner: from.toLowerCase(),
      erc721Template: erc721TemplateEntity,
    });

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  public async mintRandom(event: ILogEvent<IErc721TokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, dropboxId },
    } = event;

    const erc721TemplateEntity = await this.erc721TemplateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let erc721DropboxEntity; // if minted as Staking reward
    if (~~dropboxId !== 0) {
      erc721DropboxEntity = await this.erc721TokenService.findOne({ id: ~~dropboxId });

      if (!erc721DropboxEntity) {
        throw new NotFoundException("dropboxNotFound");
      }
    }

    const erc721TokenEntity = await this.erc721TokenService.create({
      tokenId,
      attributes: Object.assign(erc721TemplateEntity.attributes, {
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      owner: to.toLowerCase(),
      erc721Template: erc721TemplateEntity,
      erc721Token: erc721DropboxEntity,
    });

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IErc721RandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc721TokenEventData>, context: Log, erc721TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc721TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc721TokenEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      erc721TokenId: erc721TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
