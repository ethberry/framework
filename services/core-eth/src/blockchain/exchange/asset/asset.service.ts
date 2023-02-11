import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, IsNull, Repository } from "typeorm";

import { ExchangeType, IExchangeItem, IExchangePurchaseEvent } from "@framework/types";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { EventHistoryEntity } from "../../event-history/event-history.entity";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @InjectRepository(AssetComponentHistoryEntity)
    private readonly assetComponentHistoryEntityRepository: Repository<AssetComponentHistoryEntity>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    protected readonly eventHistoryService: EventHistoryService,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async createAssetHistory(dto: DeepPartial<AssetComponentHistoryEntity>): Promise<AssetComponentHistoryEntity> {
    return this.assetComponentHistoryEntityRepository.create(dto).save();
  }

  public async updateAssetHistory(transactionHash: string, tokenId: number): Promise<void> {
    const queryBuilder = this.assetComponentHistoryEntityRepository.createQueryBuilder("assets");
    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("assets.history", "history");
    queryBuilder.where({ exchangeType: ExchangeType.ITEM, tokenId: IsNull() });
    queryBuilder.andWhere("history.transactionHash = :transactionHash", {
      transactionHash,
    });

    const assetHistoryEntity = await queryBuilder.getOne();

    if (assetHistoryEntity) {
      Object.assign(assetHistoryEntity, { tokenId });
      await assetHistoryEntity.save();
    }
  }

  public async updateAssetHistoryRandom(requestId: string, tokenId: number): Promise<void> {
    const historyEntity = await this.eventHistoryService.findByRandomRequest(requestId);
    if (historyEntity) {
      const transactionHash = historyEntity.transactionHash;

      const queryBuilder = this.assetComponentHistoryEntityRepository.createQueryBuilder("assets");
      queryBuilder.select();
      queryBuilder.leftJoinAndSelect("assets.history", "history");
      queryBuilder.where({ exchangeType: ExchangeType.ITEM, tokenId: IsNull() });
      queryBuilder.andWhere("history.transactionHash = :transactionHash", {
        transactionHash,
      });

      const assetHistoryEntity = await queryBuilder.getOne();

      if (assetHistoryEntity) {
        Object.assign(assetHistoryEntity, { tokenId });
        await assetHistoryEntity.save();
      }
    }
  }

  public async saveAssetHistory(
    eventHistoryEntity: EventHistoryEntity,
    items: Array<IExchangeItem>,
    price: Array<IExchangeItem>,
  ): Promise<void> {
    await Promise.allSettled(
      items.map(async ([itemType, _itemTokenAddr, itemTokenId, itemAmount]) => {
        const assetComponentHistoryItem = {
          historyId: eventHistoryEntity.id,
          exchangeType: ExchangeType.ITEM,
          amount: itemAmount,
        };

        const templateEntity = await this.templateService.findOne(
          {
            id: itemType === 4 ? ~~(eventHistoryEntity.eventData as IExchangePurchaseEvent).externalId : ~~itemTokenId,
          },
          { relations: { tokens: true } },
        );
        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }

        Object.assign(assetComponentHistoryItem, {
          tokenId: itemType === 0 || itemType === 1 || itemType === 4 ? templateEntity.tokens[0].id : null,
          contractId: templateEntity.contractId,
        });

        return this.createAssetHistory(assetComponentHistoryItem);
      }),
    );

    await Promise.allSettled(
      price.map(async ([_priceType, _priceTokenAddr, priceTokenId, priceAmount]) => {
        const assetComponentHistoryPrice = {
          historyId: eventHistoryEntity.id,
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

        return this.createAssetHistory(assetComponentHistoryPrice);
      }),
    );
  }
}
