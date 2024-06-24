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
import { ContractFeatures, TokenType } from "@framework/types";

import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { AssetEntity } from "./asset.entity";

@Injectable()
export class AssetService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // This method accepts no arguments because all logic is in `update`
  public async create(): Promise<AssetEntity> {
    return this.assetEntityRepository
      .create({
        components: [],
      })
      .save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto, userEntity: UserEntity): Promise<void> {
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
          relations:
            component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20
              ? {
                  contract: true,
                  tokens: true,
                }
              : {
                  contract: true,
                },
        });

        if (!templateEntity) {
          throw new NotFoundException("templateNotFound");
        }

        if (templateEntity.contract.merchantId !== userEntity.merchantId) {
          // BUSINESS_TYPE=B2B
          if (
            !(
              templateEntity.contract.merchantId === 1 &&
              templateEntity.contract.contractFeatures.includes(ContractFeatures.EXTERNAL)
            )
          ) {
            throw new ForbiddenException("insufficientPermissions");
          }
        }

        if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
          component.templateId = templateEntity.id;
          component.tokenId = templateEntity.tokens[0].id;
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
            .filter(oldItem => oldItem.id)
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
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
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
            .filter(c => c.status === "fulfilled")
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
            .map(c => c.value),
        );
        Object.assign(asset, { components: [...changedComponents, ...newComponents] });
      } else {
        // clear all
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

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<Array<AssetEntity>> {
    return this.assetEntityRepository.find({ where, ...options });
  }
}
