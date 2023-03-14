import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListService } from "./access-list.service";
import { AccessListEntity } from "./access-list.entity";
import { AccessListController } from "./access-list.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AccessListEntity])],
  providers: [AccessListService],
  controllers: [AccessListController],
  exports: [AccessListService],
})
export class AccessListModule {}
