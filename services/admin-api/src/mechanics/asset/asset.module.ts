import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [forwardRef(() => TemplateModule), TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity])],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
