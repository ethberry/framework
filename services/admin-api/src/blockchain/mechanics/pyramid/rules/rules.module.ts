import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidRulesService } from "./rules.service";
import { PyramidRulesController } from "./rules.controller";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidStakesModule } from "../stakes/stakes.module";
import { AssetModule } from "../../asset/asset.module";

@Module({
  imports: [AssetModule, PyramidStakesModule, TypeOrmModule.forFeature([PyramidRulesEntity])],
  providers: [PyramidRulesService],
  controllers: [PyramidRulesController],
  exports: [PyramidRulesService],
})
export class PyramidRulesModule {}
