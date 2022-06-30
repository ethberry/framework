import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  Erc998TokenEventType,
  IErc998AirdropRedeem,
  IErc998DefaultRoyaltyInfo,
  IErc998RandomRequest,
  IUniTokenApprove,
  IUniTokenApprovedForAll,
  IUniTokenMintRandom,
  IUniTokenRoyaltyInfo,
  IUniTokenTransfer,
  TErc998TokenEventData,
  TokenRarity,
  UniTokenStatus,
} from "@framework/types";

import { delay } from "../../common/utils";
import { Erc998TemplateService } from "../template/template.service";
import { Erc998CollectionService } from "../contract/contract.service";
import { Erc998TokenHistoryService } from "./token-history/token-history.service";
import { Erc998TokenService } from "./token.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc998TokenServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc998TokenService: Erc998TokenService,
    private readonly erc998TemplateService: Erc998TemplateService,
    private readonly erc998TokenHistoryService: Erc998TokenHistoryService,
    private readonly erc998CollectionService: Erc998CollectionService,
  ) {
    this.airdropAddr = configService.get<string>("ERC998_AIRDROP_ADDR", "");
    this.itemsAddr = configService.get<string>("ERC998_ITEM_ADDR", "");
  }

  public async transfer(event: ILogEvent<IUniTokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;

    // Wait until Token will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(
      `Erc998Transfer@${context.address.toLowerCase()}: awaiting tokenId ${tokenId}`,
      Erc998TokenServiceEth.name,
    );
    await delay(1618);

    const erc998TokenEntity = await this.erc998TokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);

    if (from === constants.AddressZero) {
      erc998TokenEntity.uniTemplate.amount += 1;
      // erc998TokenEntity.uniTemplate
      //   ? (erc998TokenEntity.uniTemplate.instanceCount += 1)
      //   : (erc998TokenEntity.erc998Dropbox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = UniTokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // erc998TokenEntity.erc998Template.instanceCount -= 1;
      erc998TokenEntity.tokenStatus = UniTokenStatus.BURNED;
    }

    erc998TokenEntity.owner = to;

    await erc998TokenEntity.save();

    // need to save updates in nested entities too
    await erc998TokenEntity.uniTemplate.save();
    // erc998TokenEntity.erc998Template
    //   ? await erc998TokenEntity.erc998Template.save()
    //   : await erc998TokenEntity.erc998Dropbox.erc998Template.save();
  }

  public async approval(event: ILogEvent<IUniTokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const erc998TokenEntity = await this.erc998TokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<IUniTokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async defaultRoyaltyInfo(event: ILogEvent<IErc998DefaultRoyaltyInfo>, context: Log): Promise<void> {
    const {
      args: { royaltyNumerator },
    } = event;

    const erc998CollectionEntity = await this.erc998CollectionService.findOne({
      address: context.address.toLowerCase(),
    });

    if (!erc998CollectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    erc998CollectionEntity.royalty = BigNumber.from(royaltyNumerator).toNumber();

    await erc998CollectionEntity.save();

    await this.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<IUniTokenRoyaltyInfo>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async redeem(event: ILogEvent<IErc998AirdropRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const erc998TemplateEntity = await this.erc998TemplateService.findOne({ id: ~~templateId });

    if (!erc998TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc998TokenEntity = await this.erc998TokenService.create({
      tokenId,
      attributes: erc998TemplateEntity.attributes,
      owner: from.toLowerCase(),
      uniTemplate: erc998TemplateEntity,
    });

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async mintRandom(event: ILogEvent<IUniTokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, dropboxId },
    } = event;

    const erc998TemplateEntity = await this.erc998TemplateService.findOne({ id: ~~templateId });

    if (!erc998TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let erc998DropboxEntity; // if minted as Mechanics reward
    if (~~dropboxId !== 0) {
      erc998DropboxEntity = await this.erc998TokenService.findOne({ id: ~~dropboxId });

      if (!erc998DropboxEntity) {
        throw new NotFoundException("dropboxNotFound");
      }
    }

    const erc998TokenEntity = await this.erc998TokenService.create({
      tokenId,
      attributes: Object.assign(erc998TemplateEntity.attributes, {
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      owner: to.toLowerCase(),
      uniTemplate: erc998TemplateEntity,
      // uniToken: erc998DropboxEntity,
    });

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IErc998RandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc998TokenEventData>, context: Log, erc998TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc998TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc998TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc998TokenEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      uniTokenId: erc998TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
