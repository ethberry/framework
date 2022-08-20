import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListHistoryService } from "./history.service";
import { AccessListHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessListHistoryEntity])],
  providers: [AccessListHistoryService],
  exports: [AccessListHistoryService],
})
export class AccessListHistoryModule {}
