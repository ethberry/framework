import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralHistoryEntity } from "./ref-history.entity";
import { ReferralHistoryService } from "./ref-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralHistoryEntity])],
  providers: [ReferralHistoryService],
  exports: [ReferralHistoryService],
})
export class ReferralHistoryModule {}
