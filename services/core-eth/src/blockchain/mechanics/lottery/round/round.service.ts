import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

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

  public async createEmptyAsset(): Promise<AssetEntity> {
    return await this.assetService.create({
      components: [],
    });
  }
}
