import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RentEntity } from "./rent.entity";
import { RentService } from "./rent.service";
import { RentController } from "./rent.controller";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([RentEntity])],
  providers: [RentService],
  controllers: [RentController],
  exports: [RentService],
})
export class RentModule {}
