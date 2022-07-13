import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
