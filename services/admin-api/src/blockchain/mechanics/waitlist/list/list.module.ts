import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetModule } from "../../../exchange/asset/asset.module";
import { WaitListItemModule } from "../item/item.module";
import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";
import { WaitListListController } from "./list.controller";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    forwardRef(() => WaitListItemModule),
    AssetModule,
    ContractModule,
    TypeOrmModule.forFeature([WaitListListEntity]),
  ],
  providers: [Logger, WaitListListService],
  controllers: [WaitListListController],
  exports: [WaitListListService],
})
export class WaitListListModule {}
