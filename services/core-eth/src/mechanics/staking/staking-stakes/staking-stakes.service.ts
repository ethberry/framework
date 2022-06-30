import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { IStakingStakesSearchDto } from "@framework/types";

import { StakingStakesEntity } from "./staking-stakes.entity";

@Injectable()
export class StakingStakesService {
  constructor(
    @InjectRepository(StakingStakesEntity)
    private readonly stakesEntityRepository: Repository<StakingStakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<StakingStakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakingStakesEntity>,
    options?: FindOneOptions<StakingStakesEntity>,
  ): Promise<Array<StakingStakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(dto: IStakingStakesSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    const { stakeStatus, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");

    queryBuilder.select();

    if (stakeStatus) {
      if (stakeStatus.length === 1) {
        queryBuilder.andWhere("stake.stakeStatus = :stakeStatus", { stakeStatus: stakeStatus[0] });
      } else {
        queryBuilder.andWhere("stake.stakeStatus IN(:...stakeStatus)", { stakeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("stake.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async create(dto: DeepPartial<StakingStakesEntity>): Promise<StakingStakesEntity> {
    return this.stakesEntityRepository.create(dto).save();
  }
}
