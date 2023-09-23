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
import { DataSource, DeepPartial, FindManyOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { testChainId } from "@framework/constants";
import type { IAssetDto, IAssetItem, IExchangePurchaseEvent } from "@framework/types";
import { ContractEventType, ContractFeatures, ExchangeType, TokenType } from "@framework/types";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";

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
    private readonly contractService: ContractService,
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

  public async saveAssetHistory(
    eventHistoryEntity: EventHistoryEntity,
    items: Array<IAssetItem>,
    price: Array<IAssetItem>,
  ): Promise<{ items: Array<AssetComponentHistoryEntity>; price: Array<AssetComponentHistoryEntity> }> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    return {
      items: await Promise.allSettled(
        items.map(async ({ tokenType, token, tokenId, amount }) => {
          const assetComponentHistoryItem = {
            history: eventHistoryEntity,
            exchangeType: ExchangeType.ITEM,
            amount,
          };

          const contractEntity = await this.contractService.findOne({ address: token.toLowerCase(), chainId });

          if (!contractEntity) {
            this.loggerService.error(new NotFoundException("contractNotFound"), "item", AssetService.name);
            throw new NotFoundException("contractNotFound");
          }

          const isRandom = contractEntity.contractFeatures.includes(ContractFeatures.RANDOM);
          const isNft = ~~tokenType === 2 || ~~tokenType === 3; // 721 | 998
          const isCoin = ~~tokenType === 0 || ~~tokenType === 1; // Native | 20
          const isErc1155 = ~~tokenType === 4; // 1155
          const isPurchase = eventHistoryEntity.eventType === ContractEventType.Purchase;

          if (isCoin) {
            // NATIVE & ERC20
            const tokenEntity = await this.tokenService.getToken(tokenId, token.toLowerCase(), chainId);

            if (!tokenEntity) {
              this.loggerService.error(
                new NotFoundException("tokenNotFound"),
                "item",
                tokenId,
                token.toLowerCase(),
                AssetService.name,
              );
              throw new NotFoundException("tokenNotFound");
            }

            Object.assign(assetComponentHistoryItem, {
              token: tokenEntity,
              contract: tokenEntity.template.contract,
            });
          } else if (isErc1155 && isPurchase) {
            const templateEntity = await this.templateService.findOne(
              {
                id: Number((eventHistoryEntity.eventData as IExchangePurchaseEvent).externalId),
              },
              { relations: { tokens: true, contract: true } },
            );

            if (!templateEntity) {
              this.loggerService.error(new NotFoundException("templateNotFound"), "item", AssetService.name);
              throw new NotFoundException("templateNotFound");
            }

            Object.assign(assetComponentHistoryItem, {
              token: templateEntity.tokens[0],
              contract: templateEntity.contract,
            });
          } else if (isNft || (isErc1155 && !isPurchase)) {
            // 721 && 998
            const tokenNestedEventHistoryEntity = await this.eventHistoryService.findOne(
              {
                // transactionHash: eventHistoryEntity.transactionHash,
                parentId: eventHistoryEntity.id,
                contractId: contractEntity.id,
                token: {
                  templateId: Number(tokenId),
                },
              },
              { relations: { token: { template: true } } },
            );

            if (!tokenNestedEventHistoryEntity) {
              this.loggerService.error(new NotFoundException("nestedEventNotFound"), "item", AssetService.name);
              // throw new NotFoundException("nestedEventNotFound");
            }

            // for random 721 & 998: TokenID will be updated in Transfer event at next transaction
            // if not found could be updated in Transfer event at next transaction...
            Object.assign(assetComponentHistoryItem, {
              token: isRandom ? null : tokenNestedEventHistoryEntity?.token || null,
              contract: contractEntity,
            });
          }

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
            chainId,
          );

          if (!tokenEntity) {
            this.loggerService.error(new NotFoundException("tokenNotFound"), "price", AssetService.name);
            throw new NotFoundException("tokenNotFound");
          }

          Object.assign(assetComponentHistoryPrice, {
            token: tokenEntity,
            contract: tokenEntity.template.contract,
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
