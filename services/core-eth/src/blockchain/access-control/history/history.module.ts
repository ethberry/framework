import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlHistoryService } from "./history.service";
import { AccessControlHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlHistoryEntity])],
  providers: [AccessControlHistoryService],
  exports: [AccessControlHistoryService],
})
export class AccessControlHistoryModule {}
