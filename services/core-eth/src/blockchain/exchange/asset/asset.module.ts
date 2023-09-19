import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenModule } from "../../hierarchy/token/token.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";

@Module({
  imports: [
    EventHistoryModule,
    TokenModule,
    forwardRef(() => TemplateModule),
    TypeOrmModule.forFeature([AssetEntity, AssetComponentHistoryEntity]),
  ],
  providers: [Logger, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
