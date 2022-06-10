import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPaginationDto } from "@gemunion/types-collection";
import { StakingStatus } from "@framework/types";

import { StakingEntity } from "./staking.entity";
import { IStakingCreateDto } from "./interfaces";

@Injectable()
export class StakingService {
  constructor(
    @InjectRepository(StakingEntity)
    private readonly stakingEntityRepository: Repository<StakingEntity>,
  ) {}

  public search(dto: IPaginationDto): Promise<[Array<StakingEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.stakingEntityRepository.createQueryBuilder("staking");
    queryBuilder.leftJoinAndSelect("staking.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("staking.reward", "reward");

    queryBuilder.select();

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
