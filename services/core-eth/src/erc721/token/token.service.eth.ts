import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants, ethers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ILogEvent, ETHERS_RPC } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  ContractTemplate,
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

import { blockAwait, delay } from "../../common/utils";
import { ContractHistoryService } from "../../blockchain/contract-history/contract-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { ERC721Abi } from "./token-log/interfaces";

@Injectable()
export class Erc721TokenServiceEth {
  private airdropAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    private readonly jsonRpcProvider: ethers.providers.JsonRpcProvider,
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
    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const contractTemplate = contractEntity.contractTemplate;

    // if (contractTemplate !== ContractTemplate.SIMPLE) {
    const contract = new ethers.Contract(address, ERC721Abi, this.jsonRpcProvider);

    // await block
    await blockAwait(1, this.jsonRpcProvider);

    const tokenMetaData = await contract.getTokenMetadata(tokenId);

    // todo interface to get by metadata key enum
    const templateId = BigNumber.from(tokenMetaData[0].value).toNumber();

    console.info("Got TokenMetaData:", tokenMetaData, templateId);

    const templateEntity = await this.templateService.findOne({ id: templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const attributes =
      contractTemplate === ContractTemplate.RANDOM
        ? Object.assign(templateEntity.attributes, {
            rarity: Object.values(TokenRarity)[BigNumber.from(tokenMetaData[1].value).toNumber()],
          })
        : contractTemplate === ContractTemplate.GRADED
        ? Object.assign(templateEntity.attributes, {
            grade: Object.values(TokenRarity)[BigNumber.from(tokenMetaData[1].value).toNumber()],
          })
        : templateEntity.attributes;

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes,
      royalty: contractEntity.royalty,
      template: templateEntity,
    });

    await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), "1");

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

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
    } else if (to === constants.AddressZero) {
      // erc721TokenEntity.erc721Template.instanceCount -= 1;
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();

    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
    // erc721TokenEntity.erc721Template

    //   ? await erc721TokenEntity.erc721Template.save()
    //   : await erc721TokenEntity.erc721Dropbox.erc721Template.save();
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
