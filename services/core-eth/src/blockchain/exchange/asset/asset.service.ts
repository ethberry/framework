import {
  forwardRef,
  Logger,
  LoggerService,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { DataSource, DeepPartial, IsNull, Repository } from "typeorm";

import { ExchangeType, TokenType, IAssetDto, IExchangeItem, IExchangePurchaseEvent } from "@framework/types";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

@Injectable()
export class AssetService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @InjectRepository(AssetComponentHistoryEntity)
    private readonly assetComponentHistoryEntityRepository: Repository<AssetComponentHistoryEntity>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    protected readonly eventHistoryService: EventHistoryService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // patch NATIVE and ERC20 tokens
      for (const component of dto.components) {
        if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
          const templateEntity = await queryRunner.manager.findOne(TemplateEntity, {
            where: { contractId: component.contractId },
          });

          if (!templateEntity) {
            throw new NotFoundException("templateNotFound");
          }
          component.templateId = templateEntity.id;
        }
      }
      if (dto.components.length) {
        // remove old
        await Promise.allSettled(
          asset.components
            .filter(oldItem => !dto.components.find(newItem => newItem.id === oldItem.id))
            .map(oldItem => queryRunner.manager.remove(oldItem)),
        );
        // change existing
        const changedComponents = await Promise.allSettled(
          asset.components
            .filter(oldItem => dto.components.find(newItem => newItem.id === oldItem.id))
            .map(oldItem => {
              Object.assign(
                oldItem,
                dto.components.find(newItem => newItem.id === oldItem.id),
                // this prevents typeorm to override ids using existing relations
                { template: void 0, contract: void 0 },
              );
              return queryRunner.manager.save(oldItem);
            }),
        ).then(values =>
          values
            .filter(c => c.status === "fulfilled")
            .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
            .map(c => c.value),
        );
        const newComponents = await Promise.allSettled(
          dto.components
            .filter(newItem => !newItem.id)
            .map(newItem => {
              return queryRunner.manager.create(AssetComponentEntity, { ...newItem, assetId: asset.id }).save();
            }),
        ).then(values =>
          values
            .filter(c => c.status === "fulfilled")
            .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
            .map(c => c.value),
        );
        Object.assign(asset, { components: [...changedComponents, ...newComponents] });
      }
      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();
    } catch (e) {
      this.loggerService.error(e, AssetService.name);

      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException("internalServerError");
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
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
