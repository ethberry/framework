import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IStakesSearchDto } from "@framework/types";

import { StakesEntity } from "./stakes.entity";

@Injectable()
export class StakesService {
  constructor(
    @InjectRepository(StakesEntity)
    private readonly stakesEntityRepository: Repository<StakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakesEntity>,
    options?: FindOneOptions<StakesEntity>,
  ): Promise<StakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakesEntity>,
    options?: FindOneOptions<StakesEntity>,
  ): Promise<Array<StakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(dto: IStakesSearchDto): Promise<[Array<StakesEntity>, number]> {
    const { stakeStatus, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stakes");
    queryBuilder.leftJoinAndSelect("stakes.stakingRule", "stakingRule");

    queryBuilder.select();

    if (stakeStatus) {
      if (stakeStatus.length === 1) {
        queryBuilder.andWhere("stakes.stakeStatus = :stakeStatus", { stakeStatus: stakeStatus[0] });
      } else {
        queryBuilder.andWhere("stakes.stakeStatus IN(:...stakeStatus)", { stakeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("stakes.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }
}
