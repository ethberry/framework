import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";
import type { IReferralLeaderboard, IReferralLeaderboardSearchDto, IReferralReportSearchDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ReferralRewardEntity } from "./reward.entity";
import type { IReferralClaimSearchDto } from "../claim/dto";

export interface IReferralRewardSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralRewardEntityRepository: Repository<ReferralRewardEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<IReferralRewardSearchDto>,
    userEntity: UserEntity,
    noClaim?: boolean,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    const { merchantIds, query, startTimestamp, endTimestamp, skip, take } = dto;
    const queryBuilder = this.referralRewardEntityRepository.createQueryBuilder("reward");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("reward.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("reward.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.leftJoinAndSelect("reward.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.token", "item_token");

    queryBuilder.leftJoinAndSelect("reward.contract", "contract");

    queryBuilder.leftJoinAndSelect("reward.history", "history");
    queryBuilder.leftJoinAndSelect("history.parent", "parent");

    queryBuilder.leftJoinAndSelect("reward.shares", "shares");
    queryBuilder.leftJoinAndSelect("shares.claim", "shares_claim");
    queryBuilder.leftJoinAndSelect("shares_claim.claim", "claim");

    queryBuilder.andWhere("shares.referrer = :referrer", {
      referrer: userEntity.wallet,
    });

    if (noClaim) {
      queryBuilder.andWhere("shares.claimId is null");
    }

    if (merchantIds) {
      if (merchantIds.length === 1) {
        queryBuilder.andWhere("reward.merchantId = :merchantId", {
          merchantId: merchantIds[0],
        });
      } else {
        queryBuilder.andWhere("reward.merchantId IN(:...merchantIds)", { merchantIds });
      }
    }

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("reward.createdAt >= :startTimestamp AND reward.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
    }

    if (query) {
      queryBuilder.andWhere("reward.referrer ILIKE '%' || :referrer || '%'", { referrer: query });
    }

    if (query) {
      queryBuilder.andWhere("reward.referrer ILIKE '%' || :referrer || '%'", { referrer: query });
    }

    if (skip) {
      queryBuilder.skip(skip);
    }

    if (take) {
      queryBuilder.take(take);
    }

    return queryBuilder.getManyAndCount();
  }

  public async leaderboard(dto: IReferralLeaderboardSearchDto): Promise<[Array<IReferralLeaderboard>, number]> {
    const { skip, take } = dto;

    const queryString = `
      SELECT
        row_number() OVER (ORDER BY account)::INTEGER id,
--         SUM(amount) AS amount,
        account
      FROM
        ${ns}.referral_reward as reward
      GROUP BY
        account
    `;

    return Promise.all([
      this.entityManager.query(`SELECT COUNT(DISTINCT(id))::INTEGER as count FROM (${queryString}) as l`),
      this.entityManager.query(`${queryString} ORDER BY count DESC OFFSET $1 LIMIT $2`, [skip, take]),
    ]).then(([list, [{ count }]]) => [list, count]);
  }

  public findOne(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindOneOptions<ReferralRewardEntity>,
  ): Promise<ReferralRewardEntity | null> {
    return this.referralRewardEntityRepository.findOne({ where, ...options });
  }

  // TODO rework export use asset
  public async export(dto: Partial<IReferralReportSearchDto>, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest, userEntity);

    const headers = ["id", "referrer", "createdAt", "amount"];

    return parse(
      list.map(referralRewardEntity => ({
        id: referralRewardEntity.id,
        referrer: referralRewardEntity.referrer,
        createdAt: referralRewardEntity.createdAt,
        // amount: formatEther(referralRewardEntity.amount),
      })),
      { fields: headers },
    );
  }

  public async getRefRewards(
    dto: Partial<IReferralClaimSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    const { merchantIds = [], skip, take } = dto;

    const [allRefEvents, count] = await this.search(
      { merchantIds: merchantIds.length > 0 ? merchantIds : undefined, skip, take },
      userEntity,
    );

    return [allRefEvents, count];
  }
}
