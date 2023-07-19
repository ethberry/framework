import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";
import { WaitListListController } from "./list.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WaitListListEntity])],
  providers: [Logger, WaitListListService],
  controllers: [WaitListListController],
  exports: [WaitListListService],
})
export class WaitListListModule {}
