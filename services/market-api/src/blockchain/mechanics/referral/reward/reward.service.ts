import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import { IReferralLeaderboard, IReferralLeaderboardSearchDto, IReferralReportSearchDto } from "@framework/types";

import { ReferralRewardEntity } from "./reward.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { parse } from "json2csv";
import { formatEther } from "./reward.utils";

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralRewardEntityRepository: Repository<ReferralRewardEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<IReferralReportSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    const { query, startTimestamp, endTimestamp, skip, take } = dto;
    const queryBuilder = this.referralRewardEntityRepository.createQueryBuilder("reward");

    queryBuilder.select();

    queryBuilder.andWhere("reward.account = :address", {
      address: userEntity.wallet,
    });

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("reward.createdAt >= :startTimestamp AND reward.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
    }

    if (query) {
      queryBuilder.andWhere("reward.referrer ILIKE '%' || :referrer || '%'", { referrer: query });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async leaderboard(dto: IReferralLeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
      SELECT
        row_number() OVER (ORDER BY account)::INTEGER id,
        SUM(amount) AS amount,
        account
      FROM
        ${ns}.referral_reward as reward
      GROUP BY
        account
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

  public async export(dto: IReferralReportSearchDto, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest, userEntity);

    const headers = ["id", "referrer", "createdAt", "amount"];

    return parse(
      list.map(referralRewardEntity => ({
        id: referralRewardEntity.id,
        referrer: referralRewardEntity.referrer,
        createdAt: referralRewardEntity.createdAt,
        amount: formatEther(referralRewardEntity.amount),
      })),
      { fields: headers },
    );
  }
}
