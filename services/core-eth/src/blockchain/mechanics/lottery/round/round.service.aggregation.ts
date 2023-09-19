import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { AssetService } from "../../../exchange/asset/asset.service";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";

@Injectable()
export class LotteryRoundAggregationService {
  constructor(
    @InjectRepository(LotteryRoundAggregationEntity)
    private readonly roundAggregationEntityRepository: Repository<LotteryRoundAggregationEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async create(dto: DeepPartial<LotteryRoundAggregationEntity>): Promise<LotteryRoundAggregationEntity> {
    return this.roundAggregationEntityRepository.create(dto).save();
  }
}
