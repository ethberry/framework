import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { CraftController } from "./craft.controller";

@Module({
  imports: [AssetModule, EventHistoryModule, TypeOrmModule.forFeature([CraftEntity])],
  providers: [CraftService],
  controllers: [CraftController],
  exports: [CraftService],
})
export class CraftModule {}
