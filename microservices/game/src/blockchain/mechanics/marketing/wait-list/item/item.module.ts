import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListItemEntity } from "./item.entity";
import { WaitListItemService } from "./item.service";
import { WaitListItemController } from "./item.controller";
import { WaitListListModule } from "../list/list.module";

@Module({
  imports: [WaitListListModule, TypeOrmModule.forFeature([WaitListItemEntity])],
  providers: [WaitListItemService],
  controllers: [WaitListItemController],
  exports: [WaitListItemService],
})
export class WaitListItemModule {}
