import { Injectable } from "@nestjs/common";
import { parse } from "json2csv";

import type { IAchievementsReportSearchDto } from "@framework/types";

import { AchievementItemEntity } from "../item/item.entity";
import { AchievementItemService } from "../item/item.service";

@Injectable()
export class AchievementReportService {
  constructor(private readonly achievementItemService: AchievementItemService) {}

  public async search(dto: Partial<IAchievementsReportSearchDto>): Promise<[Array<AchievementItemEntity>, number]> {
    return this.achievementItemService.search(dto);
  }

  public async export(dto: IAchievementsReportSearchDto): Promise<string> {
    const { skip: _skip, take: _take, ...rest } = dto;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [list] = await this.search(rest as IAchievementsReportSearchDto);

    const headers = ["id", "account", "createdAt"];

    return parse(
      list.map(achievementItemEntity => ({
        id: achievementItemEntity.id,
        // account: achievementItemEntity.account,
        createdAt: achievementItemEntity.createdAt,
      })),
      { fields: headers },
    );
  }
}
