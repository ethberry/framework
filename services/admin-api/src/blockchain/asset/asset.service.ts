import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { AssetEntity } from "./asset.entity";
import { IAssetDto } from "./interfaces";
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
    if (dto.components.length) {
      // remove old
      await Promise.allSettled(
        asset.components
          .filter(oldItem => !dto.components.find(newItem => newItem.tokenId === oldItem.tokenId))
          .map(oldItem => oldItem.remove()),
      );

      // change existing
      const changedComponents = await Promise.allSettled(
        asset.components
          .filter(oldItem => dto.components.find(newItem => newItem.tokenId === oldItem.tokenId))
          .map(oldItem => {
            oldItem.amount = dto.components.find(newItem => newItem.tokenId === oldItem.tokenId)!.amount;
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
          .filter(newItem => !asset.components.find(oldItem => newItem.tokenId === oldItem.tokenId))
          .map(newItem => this.assetComponentEntityRepository.create({ ...newItem, assetId: asset.id }).save()),
      ).then(values =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<AssetComponentEntity>>c)
          .map(c => c.value),
      );
      console.log("changedComponents", changedComponents);
      console.log("newComponents", newComponents);
      Object.assign(asset, { components: [...changedComponents, ...newComponents] });
    }

    return asset.save();
  }
}
