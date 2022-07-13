import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IAirdropRedeem,
  IDropboxUnpack,
  IDefaultRoyaltyInfo,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
  TokenStatus,
  TContractEventData,
} from "@framework/types";

import { delay } from "../../common/utils";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { ContractHistoryService } from "../../blockchain/contract-history/contract-history.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";

@Injectable()
export class DropboxServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly balanceService: BalanceService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly contractService: ContractService,
  ) {
    this.airdropAddr = configService.get<string>("AIRDROP_ADDR", "");
    this.itemsAddr = configService.get<string>("ERC721_ITEM_ADDR", "");
  }

  public async transfer(event: ILogEvent<ITokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;

    // Wait until IToken will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(
      `Erc721Transfer@${context.address.toLowerCase()}: awaiting tokenId ${tokenId}`,
      DropboxServiceEth.name,
    );
    await delay(1618);

    const TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, TokenEntity.id);

    if (from === constants.AddressZero) {
      TokenEntity.template.amount += 1;
      // TokenEntity.erc721Template
      //   ? (TokenEntity.erc721Template.instanceCount += 1)
      //   : (TokenEntity.erc721Dropbox.erc721Template.instanceCount += 1);
      TokenEntity.tokenStatus = TokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // TokenEntity.erc721Template.instanceCount -= 1;
      TokenEntity.tokenStatus = TokenStatus.BURNED;
    }

    // change token's owner
    TokenEntity.balance.account = to.toLowerCase();

    await TokenEntity.save();

    // need to save updates in nested entities too
    await TokenEntity.template.save();
    await TokenEntity.balance.save();

    // TokenEntity.erc721Template
    //   ? await TokenEntity.erc721Template.save()
    //   : await TokenEntity.erc721Dropbox.erc721Template.save();
  }

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, TokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<ITokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async defaultRoyaltyInfo(event: ILogEvent<IDefaultRoyaltyInfo>, context: Log): Promise<void> {
    const {
      args: { royaltyNumerator },
    } = event;

    const contractEntity = await this.contractService.findOne({
      address: context.address.toLowerCase(),
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    contractEntity.royalty = BigNumber.from(royaltyNumerator).toNumber();

    await contractEntity.save();

    await this.updateHistory(event, context);
  }

  public async tokenRoyaltyInfo(event: ILogEvent<ITokenRoyaltyInfo>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async redeem(event: ILogEvent<IAirdropRedeem>, context: Log): Promise<void> {
    const {
      args: { from, tokenId, templateId },
    } = event;

    const templateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const TokenEntity = await this.tokenService.create({
      tokenId,
      attributes: templateEntity.attributes,
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
    });

    await this.balanceService.create({
      account: from.toLowerCase(),
      amount: "1",
      tokenId: TokenEntity.id,
    });

    await this.updateHistory(event, context, TokenEntity.id);
  }

  public async unpack(event: ILogEvent<IDropboxUnpack>, context: Log): Promise<void> {
    const {
      args: { collection, tokenId },
    } = event;

    const contractEntity = await this.contractService.findOne({ address: collection.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, TokenEntity.id);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log, TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), DropboxServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
