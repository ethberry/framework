import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { ReferralRewardEntity } from "./reward.entity";
import { UserEntity } from "../../../../user/user.entity";
import { ILeaderboardSearchDto } from "../leaderboard/interfaces/search";

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralRewardEntityRepository: Repository<ReferralRewardEntity>,
  ) {}

  public async search(dto: ISearchDto, userEntity: UserEntity): Promise<[Array<ReferralRewardEntity>, number]> {
    const { skip, take } = dto;
    const queryBuilder = this.referralRewardEntityRepository.createQueryBuilder("reward");

    queryBuilder.select();

    queryBuilder.andWhere("reward.referrer = :address", {
      address: userEntity.wallet,
    });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  // TODO aggregate data
  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<ReferralRewardEntity>, number]> {
    const { skip, take } = dto;
    const queryBuilder = this.referralRewardEntityRepository.createQueryBuilder("reward");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindOneOptions<ReferralRewardEntity>,
  ): Promise<ReferralRewardEntity | null> {
    return this.referralRewardEntityRepository.findOne({ where, ...options });
  }
}
