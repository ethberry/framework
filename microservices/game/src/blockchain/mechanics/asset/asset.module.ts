import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { AssetComponentEntity } from "./asset-component.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity, AssetComponentEntity])],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
