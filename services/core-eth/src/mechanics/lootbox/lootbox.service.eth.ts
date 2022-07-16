import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IDefaultRoyaltyInfo,
  ILootboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenRoyaltyInfo,
  ITokenTransfer,
  TContractEventData,
  TokenStatus,
} from "@framework/types";

import { getMetadata } from "../../common/utils";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { ContractHistoryService } from "../../blockchain/contract-history/contract-history.service";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { ERC721Abi } from "../../erc721/token/token-log/interfaces";

@Injectable()
export class LootboxServiceEth {
  private claimAddr: string;
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    private readonly jsonRpcProvider: providers.JsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly balanceService: BalanceService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly contractService: ContractService,
  ) {
    this.claimAddr = configService.get<string>("CLAIM_PROXY_ADDR", "");
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

    // Mint token create
    if (from === constants.AddressZero) {
      const attributes = await getMetadata(tokenId, address, ERC721Abi, this.jsonRpcProvider);

      const templateEntity = await this.templateService.findOne({ id: ~~attributes.TEMPLATE_ID });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes,
        royalty: contractEntity.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), "1");
    }

    const lootboxTokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!lootboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, lootboxTokenEntity.id);

    if (from === constants.AddressZero) {
      lootboxTokenEntity.template.amount += 1;
      // lootboxTokenEntity.erc721Template
      //   ? (lootboxTokenEntity.erc721Template.instanceCount += 1)
      //   : (lootboxTokenEntity.erc721Lootbox.erc721Template.instanceCount += 1);
      lootboxTokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      // lootboxTokenEntity.erc721Template.instanceCount -= 1;
      lootboxTokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      lootboxTokenEntity.balance[0].account = to.toLowerCase();
    }

    await lootboxTokenEntity.save();

    // need to save updates in nested entities too
    await lootboxTokenEntity.template.save();
    await lootboxTokenEntity.balance[0].save();

    // lootboxTokenEntity.erc721Template
    //   ? await lootboxTokenEntity.erc721Template.save()
    //   : await lootboxTokenEntity.erc721Lootbox.erc721Template.save();
  }

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const lootboxTokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!lootboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, lootboxTokenEntity.id);
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

  public async unpack(event: ILogEvent<ILootboxUnpack>, context: Log): Promise<void> {
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
    this.loggerService.log(JSON.stringify(event, null, "\t"), LootboxServiceEth.name);

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
