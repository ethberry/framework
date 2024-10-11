import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Repository,
} from "typeorm";

import { ExchangeType, IAssetComponentDto, IAssetDto, IAssetItem, TokenType } from "@framework/types";

import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { AssetEntity } from "./asset.entity";

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
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
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

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<AssetEntity>): Promise<AssetEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "asset",
        leftJoinAndSelect: {
          asset_components: "asset.components",
          asset_contract: "asset_components.contract",
          asset_template: "asset_components.template",
          asset_token: "asset_components.token",
        },
      },
    });
  }

  public findAll(
    where: FindOptionsWhere<AssetComponentHistoryEntity>,
    options?: FindManyOptions<AssetComponentHistoryEntity>,
  ): Promise<Array<AssetComponentHistoryEntity>> {
    return this.assetComponentHistoryEntityRepository.find({ where, ...options });
  }

  // ASSET COMPONENTS
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
            .filter(
              <T extends AssetComponentEntity>(c: PromiseSettledResult<T>): c is PromiseFulfilledResult<T> =>
                c.status === "fulfilled",
            )
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
            .filter(
              <T extends AssetComponentEntity>(c: PromiseSettledResult<T>): c is PromiseFulfilledResult<T> =>
                c.status === "fulfilled",
            )
            .map(c => c.value),
        );
        Object.assign(asset, { components: [...changedComponents, ...newComponents] });
      } else {
        // remove all components
        await Promise.allSettled(asset.components.map(oldItem => queryRunner.manager.remove(oldItem)));
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

  public async updateAsset(asset: AssetEntity, dto: IAssetComponentDto): Promise<void> {
    // UPDATE
    const oldAsset: IAssetDto = {
      components: asset.components.map(item => {
        return {
          id: item.id,
          tokenType: item.contract.contractType!,
          contractId: item.contractId,
          templateId: item.templateId,
          tokenId: item.tokenId,
          amount: item.amount,
        };
      }),
    };

    const componentsToUpdate = oldAsset.components.filter(
      item => item.templateId === dto.templateId && item.tokenId === dto.tokenId,
    );

    if (componentsToUpdate.length > 0) {
      const updatedAsset = oldAsset.components.map(comp => {
        if (comp.templateId === dto.templateId && comp.tokenId === dto.tokenId) {
          return Object.assign(comp, { amount: (BigInt(comp.amount) + BigInt(dto.amount)).toString() });
        } else return comp;
      });
      // TODO negative result throw error? must not happen
      const noZeroAsset = updatedAsset.filter(item => BigInt(item.amount) > BigInt(0));
      await this.update(asset, { components: noZeroAsset });
    } else {
      oldAsset.components.push({
        tokenType: dto.tokenType,
        contractId: dto.contractId,
        templateId: dto.templateId,
        tokenId: dto.tokenId,
        amount: dto.amount,
      });
      await this.update(asset, oldAsset);
    }
  }

  public async createAsset(asset: AssetEntity, dto: Array<IAssetComponentDto>): Promise<void> {
    // CREATE
    const updAssetDto: IAssetDto = {
      components: dto,
    };
    await this.update(asset, updAssetDto);
  }

  // ASSET HISTORY
  public async createAssetHistory(dto: DeepPartial<AssetComponentHistoryEntity>): Promise<AssetComponentHistoryEntity> {
    return this.assetComponentHistoryEntityRepository.create(dto).save();
  }

  public async saveAssetHistory(
    eventHistoryEntity: EventHistoryEntity,
    items: Array<IAssetItem>,
    price: Array<IAssetItem>,
    content: Array<IAssetItem> = [],
  ): Promise<{
    items: Array<AssetComponentHistoryEntity>;
    price: Array<AssetComponentHistoryEntity>;
    content: Array<AssetComponentHistoryEntity>;
  }> {
    return {
      items: await Promise.allSettled(
        items.map(async ({ token, tokenId, amount }: IAssetItem) => {
          const assetComponentHistory = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.ITEM,
            amount,
          };

          // do not join balances
          const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), token.toLowerCase());

          if (!tokenEntity) {
            this.loggerService.error("[item] token not found", AssetService.name);
            throw new NotFoundException("tokenNotFound");
          }

          Object.assign(assetComponentHistory, {
            token: tokenEntity,
            contract: tokenEntity.template.contract,
          });

          return this.createAssetHistory(assetComponentHistory);
        }),
      ).then(values =>
        values
          .filter(
            <T extends AssetComponentHistoryEntity>(c: PromiseSettledResult<T>): c is PromiseFulfilledResult<T> =>
              c.status === "fulfilled",
          )
          .map(c => c.value),
      ),

      price: await Promise.allSettled(
        price.map(async ({ token, tokenId, amount }: IAssetItem) => {
          const assetComponentHistory = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.PRICE,
            amount,
          };

          // do not join balances
          const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), token.toLowerCase());

          if (!tokenEntity) {
            this.loggerService.error("[price] token not found", AssetService.name);
            throw new NotFoundException("tokenNotFound");
          }

          Object.assign(assetComponentHistory, {
            token: tokenEntity,
            contract: tokenEntity.template.contract,
          });

          return this.createAssetHistory(assetComponentHistory);
        }),
      ).then(values =>
        values
          .filter(
            <T extends AssetComponentHistoryEntity>(c: PromiseSettledResult<T>): c is PromiseFulfilledResult<T> =>
              c.status === "fulfilled",
          )
          .map(c => c.value),
      ),

      content: await Promise.allSettled(
        content.map(async ({ token, tokenId, amount }: IAssetItem) => {
          const assetComponentHistory = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.CONTENT,
            amount,
          };

          // do not join balances
          const tokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), token.toLowerCase());

          if (!tokenEntity) {
            this.loggerService.error("[content] token not found", AssetService.name);
            throw new NotFoundException("tokenNotFound");
          }

          Object.assign(assetComponentHistory, {
            token: tokenEntity,
            contract: tokenEntity.template.contract,
          });

          return this.createAssetHistory(assetComponentHistory);
        }),
      ).then(values =>
        values
          .filter(
            <T extends AssetComponentHistoryEntity>(c: PromiseSettledResult<T>): c is PromiseFulfilledResult<T> =>
              c.status === "fulfilled",
          )
          .map(c => c.value),
      ),
    };
  }

  public async updateAssetHistory(transactionHash: string, token: TokenEntity): Promise<void> {
    const { id, template } = token;
    const queryBuilder = this.assetComponentHistoryEntityRepository.createQueryBuilder("assets");
    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("assets.history", "history");
    queryBuilder.where({ exchangeType: ExchangeType.ITEM, tokenId: IsNull(), contractId: template.contractId });
    queryBuilder.andWhere("history.transactionHash = :transactionHash", {
      transactionHash,
    });

    const assetHistoryEntity = await queryBuilder.getOne();

    if (assetHistoryEntity) {
      Object.assign(assetHistoryEntity, { tokenId: id });
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
}
