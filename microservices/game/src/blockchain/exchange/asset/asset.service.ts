import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IAssetDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { AssetEntity } from "./asset.entity";

@Injectable()
export class AssetService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
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

  public async update(asset: AssetEntity, dto: IAssetDto, merchantEntity: MerchantEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // patch NATIVE and ERC20 tokens
      for (const component of dto.components) {
        const templateEntity = await queryRunner.manager.findOne(TemplateEntity, {
          where: {
            contractId: component.contractId,
          },
          relations: {
            contract: true,
          },
        });

        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }

        if (templateEntity.contract.merchantId !== merchantEntity.id) {
          throw new ForbiddenException("insufficientPermissions");
        }

        if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
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
        // add new
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

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }
}
