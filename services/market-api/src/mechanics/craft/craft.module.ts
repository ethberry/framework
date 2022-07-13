import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CraftService } from "./craft.service";
import { CraftController } from "./craft.controller";
import { CraftEntity } from "./craft.entity";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([CraftEntity])],
  providers: [CraftService],
  controllers: [CraftController],
  exports: [CraftService],
})
export class CraftModule {}
