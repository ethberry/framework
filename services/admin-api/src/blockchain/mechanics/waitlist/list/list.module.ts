import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";
import { WaitListListController } from "./list.controller";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([WaitListListEntity])],
  providers: [WaitListListService],
  controllers: [WaitListListController],
  exports: [WaitListListService],
})
export class WaitListListModule {}
