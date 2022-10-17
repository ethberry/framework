import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ClaimStatus,
  ExchangeEventType,
  ExchangeType,
  IExchangeClaimEvent,
  IExchangeCraftEvent,
  IExchangeGradeEvent,
  IExchangeItem,
  IExchangeMysteryEvent,
  IExchangePurchaseEvent,
  TExchangeEventData,
  IExchangeBreedEvent,
} from "@framework/types";

import { ExchangeHistoryService } from "./history/exchange-history.service";
import { ClaimService } from "../claim/claim.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AssetService } from "../asset/asset.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { ExchangeHistoryEntity } from "./history/exchange-history.entity";
import { GradeService } from "../grade/grade.service";
import { BreedServiceEth } from "../breed/breed.service.eth";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractService: ContractService,
    private readonly claimService: ClaimService,
    private readonly gradeService: GradeService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly exchangeHistoryService: ExchangeHistoryService,
    private readonly assetService: AssetService,
    private readonly breedServiceEth: BreedServiceEth,
  ) {}

  public async purchase(event: ILogEvent<IExchangePurchaseEvent>, context: Log): Promise<void> {
    const {
      args: { item, price },
    } = event;

    const history = await this.updateHistory(event, context);

    await this.saveAssetHistory(history, [item], price);
  }

  public async claim(event: ILogEvent<IExchangeClaimEvent>, context: Log): Promise<void> {
    const {
      args: { items, externalId },
    } = event;
    const history = await this.updateHistory(event, context);

    const claimEntity = await this.claimService.findOne({ id: ~~externalId });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();

    await this.saveAssetHistory(history, [items], []);
  }

  public async craft(event: ILogEvent<IExchangeCraftEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const history = await this.updateHistory(event, context);
    await this.saveAssetHistory(history, items, price);
  }

  public async breed(event: ILogEvent<IExchangeBreedEvent>, context: Log): Promise<void> {
    const {
      args: { matron, sire },
    } = event;
    const history = await this.updateHistory(event, context);

    await this.saveAssetHistory(history, [matron], [sire]);

    await this.breedServiceEth.breed(event, history.id);
  }

  public async log(event: ILogEvent<IExchangeGradeEvent | IExchangeMysteryEvent>, context: Log): Promise<void> {
    const {
      args: { items, price },
    } = event;
    const history = await this.updateHistory(event, context);
    await this.saveAssetHistory(history, [items], price);
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log): Promise<ExchangeHistoryEntity> {
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

    return exchangeHistoryEntity;
  }

  public async saveAssetHistory(
    exchangeHistoryEntity: ExchangeHistoryEntity,
    items: Array<IExchangeItem>,
    price: Array<IExchangeItem>,
  ): Promise<void> {
    await Promise.allSettled(
      items.map(async ([itemType, _itemTokenAddr, itemTokenId, itemAmount]) => {
        const assetComponentHistoryItem = {
          historyId: exchangeHistoryEntity.id,
          exchangeType: ExchangeType.ITEM,
          amount: itemAmount,
        };

        const templateEntity = await this.templateService.findOne(
          { id: itemType === 4 ? ~~exchangeHistoryEntity.eventData.externalId : ~~itemTokenId },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }

        Object.assign(assetComponentHistoryItem, {
          tokenId: itemType === 0 || itemType === 1 || itemType === 4 ? templateEntity.tokens[0].id : null,
          contractId: templateEntity.contractId,
        });

        return this.assetService.createAssetHistory(assetComponentHistoryItem);
      }),
    );

    await Promise.allSettled(
      price.map(async ([_priceType, _priceTokenAddr, priceTokenId, priceAmount]) => {
        const assetComponentHistoryPrice = {
          historyId: exchangeHistoryEntity.id,
          exchangeType: ExchangeType.PRICE,
          amount: priceAmount,
        };

        // find price item template
        const templateEntity = await this.templateService.findOne(
          { id: ~~priceTokenId },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }
        Object.assign(assetComponentHistoryPrice, {
          tokenId: templateEntity.tokens[0].id,
          contractId: templateEntity.contractId,
        });

        return this.assetService.createAssetHistory(assetComponentHistoryPrice);
      }),
    );
  }
}
