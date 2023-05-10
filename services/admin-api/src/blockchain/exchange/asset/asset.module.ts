import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";

@Module({
  imports: [forwardRef(() => TemplateModule), TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity])],
  providers: [Logger, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
