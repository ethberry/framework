import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeepPartial, FindManyOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import type { IAssetDto, IAssetItem, IExchangePurchaseEvent } from "@framework/types";
import { ExchangeType, TokenType } from "@framework/types";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class AssetService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentHistoryEntity)
    private readonly assetComponentHistoryEntityRepository: Repository<AssetComponentHistoryEntity>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // This method accepts no arguments because all logic is in `update`
  public async create(): Promise<AssetEntity> {
    return this.assetEntityRepository
      .create({
        components: [],
      })
      .save();
  }

  public findAll(
    where: FindOptionsWhere<AssetComponentHistoryEntity>,
    options?: FindManyOptions<AssetComponentHistoryEntity>,
  ): Promise<Array<AssetComponentHistoryEntity>> {
    return this.assetComponentHistoryEntityRepository.find({ where, ...options });
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
    items: Array<IAssetItem>,
    price: Array<IAssetItem>,
  ): Promise<{ items: Array<AssetComponentHistoryEntity>; price: Array<AssetComponentHistoryEntity> }> {
    return {
      items: await Promise.allSettled(
        items.map(async ({ tokenType, tokenId, amount }) => {
          const assetComponentHistoryItem = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.ITEM,
            amount,
          };

          const relations =
            ~~tokenType === 2 || ~~tokenType === 3 ? { contract: true } : { tokens: true, contract: true };
          const templateEntity = await this.templateService.findOne(
            {
              id:
                ~~tokenType === 4
                  ? Number((eventHistoryEntity.eventData as IExchangePurchaseEvent).externalId)
                  : Number(tokenId),
            },
            { relations },
          );
          if (!templateEntity) {
            this.loggerService.error(new NotFoundException("templateNotFound"), AssetService.name);
            throw new NotFoundException("templateNotFound");
          }
          Object.assign(assetComponentHistoryItem, {
            // for 721 & 998 tokenId will be updated at Transfer event
            // tokenId: ~~tokenType === 0 || ~~tokenType === 1 || ~~tokenType === 4 ? templateEntity.tokens[0].id : null,
            token: ~~tokenType === 0 || ~~tokenType === 1 || ~~tokenType === 4 ? templateEntity.tokens[0] : null,
            contract: templateEntity.contract,
          });

          return this.createAssetHistory(assetComponentHistoryItem);
        }),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentHistoryEntity>>c)
          .map(c => c.value),
      ),

      price: await Promise.allSettled(
        price.map(async ({ token, tokenId, amount }) => {
          const assetComponentHistoryPrice = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.PRICE,
            amount,
          };

          // do not join balances
          const tokenEntity = await this.tokenService.getToken(
            Number(tokenId).toString(),
            token.toLowerCase(),
            void 0,
            false,
          );
          if (!tokenEntity) {
            this.loggerService.error(new NotFoundException("tokenNotFound"), AssetService.name);
            throw new NotFoundException("tokenNotFound");
          }
          Object.assign(assetComponentHistoryPrice, {
            token: tokenEntity,
            contractId: tokenEntity.template.contractId,
          });

          return this.createAssetHistory(assetComponentHistoryPrice);
        }),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentHistoryEntity>>c)
          .map(c => c.value),
      ),
    };
  }
}
