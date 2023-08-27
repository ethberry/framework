import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";
import { DismantleController } from "./dismantle.controller";

@Module({
  imports: [AssetModule, EventHistoryModule, TypeOrmModule.forFeature([DismantleEntity])],
  providers: [DismantleService],
  controllers: [DismantleController],
  exports: [DismantleService],
})
export class DismantleModule {}
