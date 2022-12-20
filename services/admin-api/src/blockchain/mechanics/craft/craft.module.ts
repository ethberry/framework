import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { CraftController } from "./craft.controller";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([CraftEntity])],
  providers: [CraftService],
  controllers: [CraftController],
  exports: [CraftService],
})
export class CraftModule {}
