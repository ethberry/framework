import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./achievement-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementItemEntity])],
})
export class AchievementModule {}
