import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistListEntity } from "./list.entity";
import { WaitlistListService } from "./list.service";
import { WaitlistListController } from "./list.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistListEntity])],
  providers: [WaitlistListService],
  controllers: [WaitlistListController],
  exports: [WaitlistListService],
})
export class WaitlistListModule {}
