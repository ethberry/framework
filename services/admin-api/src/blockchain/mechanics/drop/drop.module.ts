import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropEntity } from "./drop.entity";
import { DropService } from "./drop.service";
import { DropController } from "./drop.controller";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([DropEntity])],
  providers: [DropService],
  controllers: [DropController],
  exports: [DropService],
})
export class DropModule {}
