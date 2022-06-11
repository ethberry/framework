import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { StakingStatus } from "@framework/types";

import { StakingEntity } from "./staking.entity";

@Injectable()
export class StakingService {
  constructor(
    @InjectRepository(StakingEntity)
    private readonly stakingEntityRepository: Repository<StakingEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<StakingEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.stakingEntityRepository.createQueryBuilder("staking");
    queryBuilder.leftJoinAndSelect("staking.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("staking.reward", "reward");

    queryBuilder.select();

    queryBuilder.where({ stakingStatus: StakingStatus.ACTIVE });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "staking.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public leaderboard(): Promise<[Array<any>, number]> {
    return Promise.resolve([[], 0]);
  }
}
