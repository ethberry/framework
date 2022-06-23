import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListHistoryModule } from "./access-list-history/access-list-history.module";

@Module({
  imports: [AccessListHistoryModule, TypeOrmModule.forFeature([AccessListEntity])],
  providers: [AccessListService],
  exports: [AccessListService],
})
export class AccessListModule {}
