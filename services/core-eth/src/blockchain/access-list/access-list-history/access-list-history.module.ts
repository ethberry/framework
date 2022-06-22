import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListHistoryService } from "./access-list-history.service";
import { AccessListHistoryEntity } from "./access-list-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessListHistoryEntity])],
  providers: [AccessListHistoryService],
  exports: [AccessListHistoryService],
})
export class AccessListHistoryModule {}
