import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemService } from "./item.service";

@Module({
  imports: [TypeOrmModule.forFeature([WaitListItemEntity])],
  providers: [WaitListItemService],
  exports: [WaitListItemService],
})
export class WaitListItemModule {}
