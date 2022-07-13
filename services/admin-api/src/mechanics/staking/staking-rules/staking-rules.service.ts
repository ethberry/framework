import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetType, IStakingSearchDto, StakingStatus } from "@framework/types";

import { StakingRulesEntity } from "./staking-rules.entity";
import { IStakingCreateDto, IStakingUpdateDto } from "./interfaces";
import { AssetService } from "../../asset/asset.service";

@Injectable()
export class StakingRulesService {
  constructor(
    @InjectRepository(StakingRulesEntity)
    private readonly stakingRuleEntityRepository: Repository<StakingRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public search(dto: IStakingSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    const { query, deposit, reward, stakingStatus, skip, take } = dto;

    const queryBuilder = this.stakingRuleEntityRepository.createQueryBuilder("rule");
    queryBuilder.leftJoinAndSelect("rule.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("rule.reward", "reward");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(rule.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("rule.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (stakingStatus) {
      if (stakingStatus.length === 1) {
        queryBuilder.andWhere("rule.stakingStatus = :stakingStatus", { stakingStatus: stakingStatus[0] });
      } else {
        queryBuilder.andWhere("rule.stakingStatus IN(:...stakingStatus)", { stakingStatus });
      }
    }

    if (deposit && deposit.tokenType) {
      if (deposit.tokenType.length === 1) {
        queryBuilder.andWhere("deposit.tokenType = :depositTokenType", { depositTokenType: deposit.tokenType[0] });
      } else {
        queryBuilder.andWhere("deposit.tokenType IN(:...depositTokenType)", { depositTokenType: deposit.tokenType });
      }
    }

    if (reward && reward.tokenType) {
      if (reward.tokenType.length === 1) {
        queryBuilder.andWhere("reward.tokenType = :rewardTokenType", { rewardTokenType: reward.tokenType[0] });
      } else {
        queryBuilder.andWhere("reward.tokenType IN(:...rewardTokenType)", { rewardTokenType: reward.tokenType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rule.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<StakingRulesEntity>,
    options?: FindOneOptions<StakingRulesEntity>,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingRuleEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IStakingCreateDto): Promise<StakingRulesEntity> {
    const { deposit, reward } = dto;

    const depositEntity = await this.assetService.create({
      assetType: AssetType.STAKING,
      externalId: "0",
      components: [],
    });
    await this.assetService.update(depositEntity, deposit);

    const rewardEntity = await this.assetService.create({
      assetType: AssetType.STAKING,
      externalId: "0",
      components: [],
    });
    await this.assetService.update(rewardEntity, reward);

    Object.assign(dto, { deposit: depositEntity, reward: rewardEntity });

    return this.stakingRuleEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<StakingRulesEntity>,
    dto: IStakingUpdateDto,
  ): Promise<StakingRulesEntity> {
    const { reward, deposit, ...rest } = dto;
    const stakingEntity = await this.findOne(where, { relations: { deposit: true, reward: true } });

    if (!stakingEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(stakingEntity.deposit, deposit);
    Object.assign(stakingEntity.reward, reward);

    Object.assign(stakingEntity, rest);

    return stakingEntity.save();
  }

  public async delete(where: FindOptionsWhere<StakingRulesEntity>): Promise<void> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      return;
    }

    if (stakingEntity.stakingStatus === StakingStatus.NEW) {
      await stakingEntity.remove();
    } else {
      Object.assign(stakingEntity, { exchangeStatus: StakingStatus.INACTIVE });
      await stakingEntity.save();
    }
  }
}
