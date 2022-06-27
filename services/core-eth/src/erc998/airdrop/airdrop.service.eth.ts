import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  Erc998AirdropStatus,
  Erc998TokenEventType,
  UniTokenStatus,
  IErc998AirdropRedeem,
  IErc998AirdropUnpack,
  IErc998DefaultRoyaltyInfo,
  IErc998TokenApprove,
  IErc998TokenApprovedForAll,
  IErc998TokenRoyaltyInfo,
  IErc998TokenTransfer,
  TErc998TokenEventData,
} from "@framework/types";

import { delay } from "../../common/utils";
import { Erc998TemplateService } from "../template/template.service";
import { Erc998CollectionService } from "../collection/collection.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { Erc998TokenService } from "../token/token.service";
import { Erc998TokenHistoryService } from "../token/token-history/token-history.service";
import { Erc998AirdropService } from "./airdrop.service";

@Injectable()
export class Erc998AirdropServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc998TokenService: Erc998TokenService,
    private readonly erc998TemplateService: Erc998TemplateService,
    private readonly erc998AirdropService: Erc998AirdropService,
    private readonly erc998TokenHistoryService: Erc998TokenHistoryService,
    private readonly erc998CollectionService: Erc998CollectionService,
  ) {
    this.airdropAddr = configService.get<string>("ERC998_AIRDROP_ADDR", "");
    this.itemsAddr = configService.get<string>("ERC998_ITEM_ADDR", "");
  }

  public async transfer(event: ILogEvent<IErc998TokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;

    // Wait until Token will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(
      `Erc998Transfer@${context.address.toLowerCase()}: awaiting tokenId ${tokenId}`,
      Erc998AirdropServiceEth.name,
    );
    await delay(1618);

    let erc998TokenEntity;
    if (context.address.toLowerCase() === this.airdropAddr) {
      const airdropEntity = await this.erc998AirdropService.findOne(
        { id: ~~tokenId },
        { relations: { erc998Token: true } },
      );
      erc998TokenEntity = airdropEntity?.erc998Token;
    } else {
      erc998TokenEntity = await this.erc998TokenService.getToken(tokenId, context.address.toLowerCase());
    }

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);

    if (from === constants.AddressZero) {
      erc998TokenEntity.erc998Template
        ? (erc998TokenEntity.erc998Template.instanceCount += 1)
        : (erc998TokenEntity.erc998Dropbox.erc998Template.instanceCount += 1);
      erc998TokenEntity.tokenStatus = UniTokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // erc998TokenEntity.erc998Template.instanceCount -= 1;
      erc998TokenEntity.tokenStatus = UniTokenStatus.BURNED;
    }

    erc998TokenEntity.owner = to;

    await erc998TokenEntity.save();

    // need to save updates in nested entities too
    erc998TokenEntity.erc998Template
      ? await erc998TokenEntity.erc998Template.save()
      : await erc998TokenEntity.erc998Dropbox.erc998Template.save();
  }

  public async approval(event: ILogEvent<IErc998TokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const erc998TokenEntity = await this.erc998TokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async approvalAirdrop(event: ILogEvent<IErc998TokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const airdropEntity = await this.erc998AirdropService.findOne(
      { id: ~~tokenId },
      { relations: { erc998Token: true } },
    );

    const erc998TokenEntity = airdropEntity?.erc998Token;

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<IErc998TokenApprovedForAll>, context: Log): Promise<void> {
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

  public async tokenRoyaltyInfo(event: ILogEvent<IErc998TokenRoyaltyInfo>, context: Log): Promise<void> {
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
      erc998Template: erc998TemplateEntity,
    });

    // Update Airdrop
    await this.erc998AirdropService.update(
      { id: ~~tokenId },
      { airdropStatus: Erc998AirdropStatus.REDEEMED, erc998Token: erc998TokenEntity },
    );

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  public async unpackAirdrop(event: ILogEvent<IErc998AirdropUnpack>, context: Log): Promise<void> {
    const {
      args: { tokenId, airdropId },
    } = event;

    const erc998TokenEntity = await this.erc998TokenService.findOne({ id: ~~airdropId });

    if (!erc998TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    // Update Airdrop status
    await this.erc998AirdropService.update({ id: ~~tokenId }, { airdropStatus: Erc998AirdropStatus.UNPACKED });

    await this.updateHistory(event, context, erc998TokenEntity.id);
  }

  private async updateHistory(event: ILogEvent<TErc998TokenEventData>, context: Log, erc998TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc998AirdropServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc998TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc998TokenEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      erc998TokenId: erc998TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
