import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidRulesService } from "./rules.service";
import { PyramidRulesController } from "./rules.controller";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidDepositModule } from "../deposit/deposit.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, PyramidDepositModule, TypeOrmModule.forFeature([PyramidRulesEntity])],
  providers: [PyramidRulesService],
  controllers: [PyramidRulesController],
  exports: [PyramidRulesService],
})
export class PyramidRulesModule {}
