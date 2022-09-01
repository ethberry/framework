import { Injectable } from "@nestjs/common";
import { IReferralReportSearchDto } from "@framework/types";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";

import { UserEntity } from "../../../../user/user.entity";
import { ReferralRewardEntity } from "../reward/reward.entity";
import { formatEther } from "../reward/reward.utils";
import { ReferralRewardService } from "../reward/reward.service";

@Injectable()
export class ReferralReportService {
  constructor(
    private readonly referralRewardService: ReferralRewardService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async search(
    dto: Partial<IReferralReportSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.search(dto, userEntity);
  }

  public async chart(dto: IReferralReportSearchDto, userEntity: UserEntity): Promise<any> {
    const { startTimestamp, endTimestamp } = dto;

    // prettier-ignore
    const queryString = `
        SELECT
            COUNT(referral_reward.id)::INTEGER AS count,
            SUM(referral_reward.amount)::NUMERIC AS amount,
            date_trunc('day', referral_reward.created_at) as date
        FROM
            ${ns}.referral_reward
        WHERE
            (referral_reward.created_at >= $1 AND referral_reward.created_at < $2)
          AND
            referral_reward.account = $3
        GROUP BY
            date
        ORDER BY
            date
    `;

    return Promise.all([this.entityManager.query(queryString, [startTimestamp, endTimestamp, userEntity.wallet]), 0]);
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
