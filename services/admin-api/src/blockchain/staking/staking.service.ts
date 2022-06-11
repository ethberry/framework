import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, Brackets } from "typeorm";

import { StakingStatus, IStakingSearchDto } from "@framework/types";

import { StakingEntity } from "./staking.entity";
import { IStakingCreateDto, IStakingUpdateDto } from "./interfaces";

@Injectable()
export class StakingService {
  constructor(
    @InjectRepository(StakingEntity)
    private readonly stakingEntityRepository: Repository<StakingEntity>,
  ) {}

  public search(dto: IStakingSearchDto): Promise<[Array<StakingEntity>, number]> {
    const { query, deposit = { tokenType: [] }, reward = { tokenType: [] }, stakingStatus, skip, take } = dto;

    const queryBuilder = this.stakingEntityRepository.createQueryBuilder("staking");
    queryBuilder.leftJoinAndSelect("staking.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("staking.reward", "reward");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(staking.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("staking.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (stakingStatus) {
      if (stakingStatus.length === 1) {
        queryBuilder.andWhere("staking.stakingStatus = :stakingStatus", { stakingStatus: stakingStatus[0] });
      } else {
        queryBuilder.andWhere("staking.stakingStatus IN(:...stakingStatus)", { stakingStatus });
      }
    }

    if (deposit.tokenType) {
      if (deposit.tokenType.length === 1) {
        queryBuilder.andWhere("deposit.tokenType = :tokenType", { tokenType: deposit.tokenType[0] });
      } else {
        queryBuilder.andWhere("deposit.tokenType IN(:...tokenType)", { tokenType: deposit.tokenType });
      }
    }

    if (reward.tokenType) {
      if (reward.tokenType.length === 1) {
        queryBuilder.andWhere("reward.tokenType = :tokenType", { tokenType: reward.tokenType[0] });
      } else {
        queryBuilder.andWhere("reward.tokenType IN(:...tokenType)", { tokenType: reward.tokenType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "staking.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<StakingEntity>,
    options?: FindOneOptions<StakingEntity>,
  ): Promise<StakingEntity | null> {
    return this.stakingEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IStakingCreateDto): Promise<StakingEntity> {
    return this.stakingEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<StakingEntity>, dto: IStakingUpdateDto): Promise<StakingEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<StakingEntity>): Promise<void> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      return;
    }

    if (stakingEntity.stakingStatus === StakingStatus.NEW) {
      await stakingEntity.remove();
    } else {
      Object.assign(stakingEntity, { recipeStatus: StakingStatus.INACTIVE });
      await stakingEntity.save();
    }
  }
}
