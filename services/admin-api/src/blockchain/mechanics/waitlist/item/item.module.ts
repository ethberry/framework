import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistItemEntity } from "./item.entity";
import { WaitlistItemService } from "./item.service";
import { WaitlistItemController } from "./item.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistItemEntity])],
  providers: [WaitlistItemService],
  controllers: [WaitlistItemController],
  exports: [WaitlistItemService],
})
export class WaitlistItemModule {}
