import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
// import { TemplateService } from "../../hierarchy/template/template.service";
import { IAssetDto, TokenType } from "@framework/types";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    // @Inject(forwardRef(() => TemplateService))
    // private readonly templateService: TemplateService,
    private dataSource: DataSource,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto): Promise<void> {
    // TODO transactions?
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
          // const templateEntity = await this.templateService.findOne({ contractId: component.contractId });

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

        // add new
        const newComponents = await Promise.allSettled(
          dto.components
            .filter(newItem => !newItem.id)
            .map(newItem => {
              return queryRunner.manager.create(AssetComponentEntity, { ...newItem, assetId: asset.id }).save();
              // return queryRunner.manager.save(this.assetComponentEntityRepository.create())
              // return this.assetComponentEntityRepository.create({ ...newItem, assetId: asset.id }).save()
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

      // throw Error("just an Error")

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      // console.log(await queryRunner.manager.findOne(AssetEntity, { ...asset }))
      // throw new Exceptio
    } finally {
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
