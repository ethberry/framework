import { Injectable } from "@nestjs/common";
import { IReferralReportSearchDto } from "@framework/types";
import { parse } from "json2csv";

import { UserEntity } from "../../../../user/user.entity";
import { ReferralRewardEntity } from "../reward/reward.entity";
import { formatEther } from "../reward/reward.utils";
import { ReferralRewardService } from "../reward/reward.service";

@Injectable()
export class ReferralReportService {
  constructor(private readonly referralRewardService: ReferralRewardService) {}

  public async search(
    dto: Partial<IReferralReportSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralRewardEntity>, number]> {
    return this.referralRewardService.search(dto, userEntity);
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
