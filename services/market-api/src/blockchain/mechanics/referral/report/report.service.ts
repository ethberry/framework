import { Injectable } from "@nestjs/common";
import { IReferralReportSearchDto } from "@framework/types";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { parse } from "json2csv";

import { ns } from "@framework/constants";
import { formatItem } from "@framework/exchange";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ReferralRewardEntity } from "../reward/reward.entity";
import { ReferralRewardService } from "../reward/reward.service";
// import { formatEther } from "../reward/reward.utils";

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

  public async chart(dto: Partial<IReferralReportSearchDto>, userEntity: UserEntity): Promise<any> {
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

  // TODO rework to use asset
  public async export(dto: Partial<IReferralReportSearchDto>, userEntity: UserEntity): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    const [list] = await this.search(rest, userEntity);

    const headers = ["id", "referrer", "account", "item", "price", "contract", "eventType", "createdAt"];

    return parse(
      list.map(referralRewardEntity => ({
        id: referralRewardEntity.id,
        referrer: referralRewardEntity.referrer,
        account: referralRewardEntity.account,
        item: formatItem(referralRewardEntity.item),
        price: formatItem(referralRewardEntity.price),
        contract: referralRewardEntity.contract.title,
        eventType: referralRewardEntity.history?.parent?.eventType,
        createdAt: referralRewardEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
