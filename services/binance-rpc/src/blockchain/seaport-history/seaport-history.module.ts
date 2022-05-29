import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SeaportHistoryService } from "./seaport-history.service";
import { SeaportHistoryEntity } from "./seaport-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SeaportHistoryEntity])],
  providers: [SeaportHistoryService],
  exports: [SeaportHistoryService],
})
export class SeaportHistoryModule {}
