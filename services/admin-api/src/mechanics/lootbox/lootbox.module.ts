import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootboxEntity } from "./lootbox.entity";
import { LootboxService } from "./lootbox.service";
import { LootboxController } from "./lootbox.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LootboxEntity])],
  providers: [LootboxService],
  controllers: [LootboxController],
  exports: [LootboxService],
})
export class LootboxModule {}
