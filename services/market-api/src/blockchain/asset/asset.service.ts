import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { AssetEntity } from "./asset.entity";
import { IAssetDto } from "../../uni-token/interfaces";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetEntityRepository: Repository<AssetEntity>,
  ) {}

  public async create(dto: DeepPartial<AssetEntity>): Promise<AssetEntity> {
    return this.assetEntityRepository.create(dto).save();
  }

  public async update(dto: IAssetDto): Promise<AssetEntity> {
    // if (raw.length) {
    //   const ingredients = Object.values(
    //     raw.reduce((memo, current) => {
    //       if (current.erc1155TokenId.toString() in memo) {
    //         current.amount += memo[current.erc1155TokenId.toString()].amount;
    //       }
    //
    //       memo[current.erc1155TokenId.toString()] = current;
    //       return memo;
    //     }, {} as Record<string, IIngredientsDto>),
    //   );
    //
    //   // remove old
    //   await Promise.allSettled(
    //     exchangeEntity.ingredients
    //       .filter(oldItem => !ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId))
    //       .map(oldItem => oldItem.remove()),
    //   );
    //
    //   // change existing
    //   const changedingredients = await Promise.allSettled(
    //     exchangeEntity.ingredients.components
    //       .filter(oldItem => ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId))
    //       .map(oldItem => {
    //         oldItem.amount = ingredients.find(newItem => newItem.erc1155TokenId === oldItem.erc1155TokenId)!.amount;
    //         return oldItem.save();
    //       }),
    //   ).then(values =>
    //     values
    //       .filter(c => c.status === "fulfilled")
    //       .map(c => <PromiseFulfilledResult<AssetEntity>>c)
    //       .map(c => c.value),
    //   );
    //
    //   // add new
    //   const newingredients = await Promise.allSettled(
    //     ingredients
    //       .filter(
    //         newItem => !exchangeEntity.ingredients.find(oldItem => newItem.erc1155TokenId === oldItem.erc1155TokenId),
    //       )
    //       .map(newItem => this.assetService.create({ ...newItem, externalId: exchangeEntity.id })),
    //   ).then(values =>
    //     values
    //       .filter(c => c.status === "fulfilled")
    //       .map(c => <PromiseFulfilledResult<AssetEntity>>c)
    //       .map(c => c.value),
    //   );
    //
    //   Object.assign(exchangeEntity, { ingredients: [...changedingredients, ...newingredients] });
    // }
    return this.assetEntityRepository.create(dto).save();
  }
}
