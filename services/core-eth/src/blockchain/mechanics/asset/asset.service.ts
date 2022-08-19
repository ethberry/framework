import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

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

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
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
}
