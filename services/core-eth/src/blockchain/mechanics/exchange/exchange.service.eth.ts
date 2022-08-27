import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ClaimStatus,
  ExchangeEventType,
  ExchangeType,
  IExchangeClaim,
  IExchangePurchase,
  TExchangeEventData,
  TokenType,
} from "@framework/types";

import { ExchangeHistoryService } from "./history/exchange-history.service";
import { ExchangeService } from "./exchange.service";
import { ClaimService } from "../claim/claim.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AssetService } from "../asset/asset.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { TemplateService } from "../../hierarchy/template/template.service";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly exchangeService: ExchangeService,
    private readonly claimService: ClaimService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly assetService: AssetService,
  ) {}

  public async purchase(event: ILogEvent<IExchangePurchase>, context: Log): Promise<void> {
    const historyId = await this.updateHistory(event, context);
    const {
      args: { item, price },
    } = event;

    // ITEM - what purchased?
    const assetComponentHistoryItem = { historyId, exchangeType: ExchangeType.ITEM };
    const itemType = Object.values(TokenType)[item[0]];
    // const itemTokenAddr = item[1];
    const itemTokenId = item[2];
    const itemAmount = item[3];

    // find item template
    const templateEntity = await this.templateService.findOne({ id: ~~itemTokenId }, { relations: { contract: true } });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }
    Object.assign(assetComponentHistoryItem, {
      tokenType: itemType,
      contractId: templateEntity.contractId,
      amount: itemAmount,
    });

    // find token by item template
    if (itemType === TokenType.NATIVE || itemType === TokenType.ERC20 || itemType === TokenType.ERC1155) {
      const tokenEntity = await this.tokenService.findOne({ templateId: ~~~~itemTokenId });

      if (!tokenEntity) {
        throw new NotFoundException("tokenNotFound");
      }
      Object.assign(assetComponentHistoryItem, {
        tokenId: tokenEntity.id,
      });
    }

    await this.assetService.createAssetHistory(assetComponentHistoryItem);

    // PRICE
    const assetComponentHistoryPriceItem = { historyId, exchangeType: ExchangeType.PRICE };
    price.map(async priceItem => {
      const priceType = Object.values(TokenType)[priceItem[0]];
      // const priceTokenAddr = priceItem[1];
      const priceTokenId = priceItem[2];
      const priceAmount = priceItem[3];

      // find price item template
      const templateEntity = await this.templateService.findOne(
        { id: ~~priceTokenId },
        { relations: { contract: true } },
      );
      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }
      Object.assign(assetComponentHistoryPriceItem, {
        tokenType: priceType,
        contractId: templateEntity.contractId,
        amount: priceAmount,
      });
      // find token by template
      const tokenEntity = await this.tokenService.findOne({ templateId: templateEntity.id });

      if (!tokenEntity) {
        throw new NotFoundException("tokenNotFound");
      }
      Object.assign(assetComponentHistoryPriceItem, {
        tokenId: tokenEntity.id,
      });

      await this.assetService.createAssetHistory(assetComponentHistoryPriceItem);
    });
  }

  // public async getTokenByTemplate(templateId: number): Promise<number> {}

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log): Promise<number> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ExchangeServiceEth.name);

    const { args, name } = event;

    const { transactionHash, address, blockNumber } = context;

    const exchangeHistoryEntity = await this.exchangeHistoryService.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));

    return exchangeHistoryEntity.id;
  }

  public async log(event: ILogEvent<TExchangeEventData>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async claim(event: ILogEvent<IExchangeClaim>, context: Log): Promise<void> {
    await this.updateHistory(event, context);

    const { args } = event;
    const { externalId } = args;

    const claimEntity = await this.claimService.findOne({ id: ~~externalId });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();
  }
}
