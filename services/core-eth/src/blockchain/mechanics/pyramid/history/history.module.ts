import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidHistoryService } from "./history.service";
import { PyramidHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PyramidHistoryEntity])],
  providers: [PyramidHistoryService],
  exports: [PyramidHistoryService],
})
export class PyramidHistoryModule {}
