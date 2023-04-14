import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./item/item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementItemEntity])],
})
export class AchievementModule {}
