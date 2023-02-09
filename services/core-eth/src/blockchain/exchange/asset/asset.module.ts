import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { ExchangeHistoryModule } from "../history/history.module";
import { ContractHistoryModule } from "../../hierarchy/contract/history/history.module";

@Module({
  imports: [
    ExchangeHistoryModule,
    ContractHistoryModule,
    forwardRef(() => TemplateModule),
    TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity, AssetComponentHistoryEntity]),
  ],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
