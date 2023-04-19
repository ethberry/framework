import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IAchievementsReportSearchDto } from "@framework/types";
import { AchievementItemEntity } from "./item.entity";

@Injectable()
export class AchievementItemService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemEntity>,
  ) {}

  public async search(dto: IAchievementsReportSearchDto): Promise<[Array<AchievementItemEntity>, number]> {
    const { account, startTimestamp, endTimestamp, skip, take } = dto;

    const queryBuilder = this.achievementItemEntityRepository.createQueryBuilder("item");

    queryBuilder.leftJoinAndSelect("item.user", "user");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("user.wallet = :wallet", {
        wallet: account,
      });
    }

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("item.createdAt >= :startTimestamp AND item.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "item.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }
}
