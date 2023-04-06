import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [
    EventHistoryModule,
    forwardRef(() => TemplateModule),
    TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity, AssetComponentHistoryEntity]),
  ],
  providers: [Logger, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
