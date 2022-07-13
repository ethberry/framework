import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IAirdropRedeem,
  IDefaultRoyaltyInfo,
  IRandomRequest,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenMintRandom,
  ITokenRoyaltyInfo,
  ITokenTransfer,
  TContractEventData,
  TokenRarity,
  TokenStatus,
} from "@framework/types";

import { delay } from "../../common/utils";
import { ContractHistoryService } from "../../blockchain/contract-history/contract-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";

@Injectable()
export class Erc721TokenServiceEth {
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

    // Wait until Token will be created by Marketplace Redeem or Airdrop Redeem or MintRandom events
    this.loggerService.log(
      `Erc721Transfer@${context.address.toLowerCase()}: awaiting tokenId ${tokenId}`,
      Erc721TokenServiceEth.name,
    );
    await delay(1618);

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, tokenEntity.id);

    if (from === constants.AddressZero) {
      tokenEntity.template.amount += 1;
      // tokenEntity.erc721Template
      //   ? (tokenEntity.erc721Template.instanceCount += 1)
      //   : (tokenEntity.erc721Dropbox.erc721Template.instanceCount += 1);
      tokenEntity.tokenStatus = TokenStatus.MINTED;
    }

    if (to === constants.AddressZero) {
      // tokenEntity.erc721Template.instanceCount -= 1;
      tokenEntity.tokenStatus = TokenStatus.BURNED;
    }

    // change token's owner
    tokenEntity.balance.account = to.toLowerCase();

    await tokenEntity.save();

    // need to save updates in nested entities too
    await tokenEntity.template.save();
    await tokenEntity.balance.save();
    // tokenEntity.erc721Template

    //   ? await tokenEntity.erc721Template.save()
    //   : await tokenEntity.erc721Dropbox.erc721Template.save();
  }

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, tokenEntity.id);
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

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes: templateEntity.attributes,
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
    });

    await this.balanceService.create({
      account: from.toLowerCase(),
      amount: "1",
      tokenId: tokenEntity.id,
    });

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async mintRandom(event: ILogEvent<ITokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, dropboxId },
    } = event;

    const templateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let erc721DropboxEntity; // if minted as Mechanics reward
    if (~~dropboxId !== 0) {
      erc721DropboxEntity = await this.tokenService.findOne({ id: ~~dropboxId });

      if (!erc721DropboxEntity) {
        throw new NotFoundException("dropboxNotFound");
      }
    }

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes: Object.assign(templateEntity.attributes, {
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
      // erc721Token: erc721DropboxEntity,
    });

    await this.balanceService.create({
      account: to.toLowerCase(),
      amount: "1",
      tokenId: tokenEntity.id,
    });

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IRandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log, erc721TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
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
