import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlHistoryService } from "./access-control-history.service";
import { AccessControlHistoryEntity } from "./access-control-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AccessControlHistoryEntity])],
  providers: [AccessControlHistoryService],
  exports: [AccessControlHistoryService],
})
export class AccessControlHistoryModule {}
