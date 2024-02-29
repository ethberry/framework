import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListListModule } from "../list/list.module";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemService } from "./item.service";
import { WaitListItemController } from "./item.controller";

@Module({
  imports: [forwardRef(() => WaitListListModule), TypeOrmModule.forFeature([WaitListItemEntity])],
  providers: [WaitListItemService],
  controllers: [WaitListItemController],
  exports: [WaitListItemService],
})
export class WaitListItemModule {}
