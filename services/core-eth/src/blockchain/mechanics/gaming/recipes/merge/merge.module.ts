import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { MergeService } from "./merge.service";
import { MergeEntity } from "./merge.entity";

@Module({
  imports: [AssetModule, EventHistoryModule, TypeOrmModule.forFeature([MergeEntity])],
  providers: [MergeService],
  exports: [MergeService],
})
export class MergeModule {}
