import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AchievementItemEntity } from "./item/item.entity";
import { UserEntity } from "../infrastructure/user/user.entity";

@Injectable()
export class AchievementsMarketplaceService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemEntity>,
  ) {}

  public create(userEntity: UserEntity): Promise<AchievementItemEntity> {
    return this.achievementItemEntityRepository
      .create({
        user: userEntity,
      })
      .save();
  }
}
