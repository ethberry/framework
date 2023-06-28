import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { StakingRulesEntity } from "./rules.entity";
import { IStakingCreateDto } from "./interfaces";
import { AssetService } from "../../../exchange/asset/asset.service";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Injectable()
export class StakingRulesService {
  constructor(
    @InjectRepository(StakingRulesEntity)
    private readonly stakingRulesEntityRepository: Repository<StakingRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingRulesEntity>,
    options?: FindOneOptions<StakingRulesEntity>,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingRulesEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IStakingCreateDto): Promise<StakingRulesEntity> {
    const { deposit, reward } = dto;

    const depositEntity = await this.assetService.create();
    await this.assetService.update(depositEntity, deposit);

    const rewardEntity = await this.assetService.create();
    await this.assetService.update(rewardEntity, reward);

    Object.assign(dto, { deposit: depositEntity, reward: rewardEntity });

    return this.stakingRulesEntityRepository.create(dto).save();
  }

  public async createEmptyAsset(): Promise<AssetEntity> {
    return this.assetService.create();
  }
}
