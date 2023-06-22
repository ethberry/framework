import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { IAssetDto } from "@framework/types";

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

  public async create(dto: DeepPartial<LotteryRoundEntity>): Promise<LotteryRoundEntity> {
    return this.roundEntityRepository.create(dto).save();
  }

  public async createEmptyPrice(): Promise<AssetEntity> {
    return this.assetService.create({
      components: [],
    });
  }

  public async updatePrice(asset: AssetEntity, price: IAssetDto): Promise<void> {
    await this.assetService.update(asset, price);
  }
}
