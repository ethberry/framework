import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { IAssetDto, TokenType } from "@framework/types";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
  ) {}

  // This method accepts no arguments because all logic is in `update`
  public async create(): Promise<AssetEntity> {
    return this.assetEntityRepository
      .create({
        components: [],
      })
      .save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto): Promise<AssetEntity> {
    // TODO transactions?

    // patch NATIVE and ERC20 tokens
    for (const component of dto.components) {
      if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
        const templateEntity = await this.templateService.findOne({ contractId: component.contractId });
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
          .map(oldItem => oldItem.remove()),
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
            return oldItem.save();
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
          .map(newItem => this.assetComponentEntityRepository.create({ ...newItem, assetId: asset.id }).save()),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
          .map(c => c.value),
      );

      Object.assign(asset, { components: [...changedComponents, ...newComponents] });
    }

    return asset.save();
  }

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }
}
