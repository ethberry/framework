import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralHistoryEntity } from "./history.entity";
import { ReferralHistoryService } from "./history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralHistoryEntity])],
  providers: [ReferralHistoryService],
  exports: [ReferralHistoryService],
})
export class ReferralHistoryModule {}
