import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateModule } from "../../hierarchy/template/template.module";

@Module({
  imports: [forwardRef(() => TemplateModule), TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity])],
  providers: [Logger, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
