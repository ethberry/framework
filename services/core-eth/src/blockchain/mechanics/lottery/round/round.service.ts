import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { IAssetDto } from "@framework/types";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Injectable()
export class LotteryRoundService {
  constructor(
    @InjectRepository(LotteryRoundEntity)
    private readonly roundEntityRepository: Repository<LotteryRoundEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<LotteryRoundEntity>,
    options?: FindOneOptions<LotteryRoundEntity>,
  ): Promise<LotteryRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public getRound(roundId: string, address: string, chainId?: number): Promise<LotteryRoundEntity | null> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("round.contract", "contract");

    queryBuilder.andWhere("round.roundId = :roundId", {
      roundId: Number(roundId).toString(),
    });

    queryBuilder.andWhere("contract.address = :address", {
      address: address.toLowerCase(),
    });

    if (chainId) {
      queryBuilder.andWhere("contract.chainId = :chainId", {
        chainId,
      });
    }

    return queryBuilder.getOne();
  }

  public async create(dto: DeepPartial<LotteryRoundEntity>): Promise<LotteryRoundEntity> {
    return this.roundEntityRepository.create(dto).save();
  }

  public async createEmptyPrice(): Promise<AssetEntity> {
    return this.assetService.create();
  }

  public async updatePrice(asset: AssetEntity, price: IAssetDto): Promise<void> {
    await this.assetService.update(asset, price);
  }
}
