import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IAssetDto } from "@framework/types";

import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
    @InjectRepository(AssetComponentEntity)
    private readonly assetComponentEntityRepository: Repository<AssetComponentEntity>,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async update(asset: AssetEntity, dto: IAssetDto): Promise<AssetEntity> {
    // TODO transactions?

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

  public findOne(
    where: FindOptionsWhere<AssetEntity>,
    options?: FindOneOptions<AssetEntity>,
  ): Promise<AssetEntity | null> {
    return this.assetEntityRepository.findOne({ where, ...options });
  }
}
