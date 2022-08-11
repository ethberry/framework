import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { ns } from "@framework/constants";

import { ReferralRewardEntity } from "./reward.entity";
import { UserEntity } from "../../../../user/user.entity";
import { ILeaderboardSearchDto, IReferralLeaderboard } from "../leaderboard/interfaces";

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralRewardEntityRepository: Repository<ReferralRewardEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(dto: ISearchDto, userEntity: UserEntity): Promise<[Array<ReferralRewardEntity>, number]> {
    const { skip, take } = dto;
    const queryBuilder = this.referralRewardEntityRepository.createQueryBuilder("reward");

    queryBuilder.select();

    queryBuilder.andWhere("reward.account = :address", {
      address: userEntity.wallet,
    });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async leaderboard(dto: ILeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
      SELECT
        row_number() OVER (ORDER BY account)::INTEGER id,
        SUM(amount) AS amount,
        account
      FROM ${ns}.referral_reward
      GROUP BY account
    `;

    return Promise.all([
      this.entityManager.query(`${queryString} ORDER BY amount DESC OFFSET $1 LIMIT $2`, [skip, take]),
      this.entityManager.query(`SELECT COUNT(DISTINCT(id))::INTEGER as count FROM (${queryString}) as l`),
    ]).then(([list, [{ count }]]) => [list, count]);
  }

  public findOne(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindOneOptions<ReferralRewardEntity>,
  ): Promise<ReferralRewardEntity | null> {
    return this.referralRewardEntityRepository.findOne({ where, ...options });
  }
}
