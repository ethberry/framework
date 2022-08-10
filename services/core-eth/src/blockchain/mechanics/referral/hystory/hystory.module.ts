import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralHistoryEntity } from "./hystory.entity";
import { ReferralHistoryService } from "./hystory.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralHistoryEntity])],
  providers: [ReferralHistoryService],
  exports: [ReferralHistoryService],
})
export class ReferralHistoryModule {}
