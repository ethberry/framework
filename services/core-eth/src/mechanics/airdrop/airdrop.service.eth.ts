import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  AirdropStatus,
  Erc721TokenEventType,
  IAirdropRedeem,
  IAirdropUnpack,
  IErc721DefaultRoyaltyInfo,
  IErc721TokenApprove,
  IErc721TokenApprovedForAll,
  IErc721TokenRoyaltyInfo,
  IErc721TokenTransfer,
  TErc721TokenEventData,
  TokenStatus,
} from "@framework/types";

import { delay } from "../../common/utils";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { Erc721TokenHistoryService } from "../../erc721/token/token-history/token-history.service";
import { AirdropService } from "./airdrop.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";

@Injectable()
export class AirdropServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly airdropService: AirdropService,
    private readonly erc721TokenHistoryService: Erc721TokenHistoryService,
    private readonly contractService: ContractService,
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
      AirdropServiceEth.name,
    );
    await delay(1618);

    let erc721TokenEntity;
    if (context.address.toLowerCase() === this.airdropAddr) {
      const airdropEntity = await this.airdropService.findOne({ id: ~~tokenId }, { relations: { item: true } });
      erc721TokenEntity = airdropEntity?.item.components[0].token;
    } else {
      erc721TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());
    }

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.template.amount += 1;
      // erc721TokenEntity.erc721Template
      //   ? (erc721TokenEntity.erc721Template.instanceCount += 1)
      //   : (erc721TokenEntity.erc721Dropbox.erc721Template.instanceCount += 1);
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // erc721TokenEntity.erc721Template.instanceCount -= 1;
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    }

    erc721TokenEntity.owner = to;

    await erc721TokenEntity.save();

    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    // erc721TokenEntity.erc721Template
    //   ? await erc721TokenEntity.erc721Template.save()
    //   : await erc721TokenEntity.erc721Dropbox.erc721Template.save();
  }

  public async approval(event: ILogEvent<IErc721TokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  public async approvalAirdrop(event: ILogEvent<IErc721TokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const airdropEntity = await this.airdropService.findOne({ id: ~~tokenId }, { relations: { item: true } });

    const erc721TokenEntity = airdropEntity?.item.components[0].token;

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

    const erc721CollectionEntity = await this.contractService.findOne({
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

  public async redeem(event: ILogEvent<IAirdropRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const erc721TemplateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!erc721TemplateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const erc721TokenEntity = await this.tokenService.create({
      tokenId,
      attributes: erc721TemplateEntity.attributes,
      owner: from.toLowerCase(),
      template: erc721TemplateEntity,
    });

    // Update Airdrop
    await this.airdropService.update(
      { id: ~~tokenId },
      {
        airdropStatus: AirdropStatus.REDEEMED,
        // TODO fix me
        // erc721Token: erc721TokenEntity
      },
    );

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  public async unpackAirdrop(event: ILogEvent<IAirdropUnpack>, context: Log): Promise<void> {
    const {
      args: { tokenId, airdropId },
    } = event;

    const erc721TokenEntity = await this.tokenService.findOne({ id: ~~airdropId });

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    // Update Airdrop status
    await this.airdropService.update({ id: ~~tokenId }, { airdropStatus: AirdropStatus.UNPACKED });

    await this.updateHistory(event, context, erc721TokenEntity.id);
  }

  private async updateHistory(event: ILogEvent<TErc721TokenEventData>, context: Log, erc721TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), AirdropServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.erc721TokenHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as Erc721TokenEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: erc721TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
