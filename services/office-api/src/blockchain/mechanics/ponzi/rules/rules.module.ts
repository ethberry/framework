import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PonziRulesService } from "./rules.service";
import { PonziRulesController } from "./rules.controller";
import { PonziRulesEntity } from "./rules.entity";
import { PonziDepositModule } from "../deposit/deposit.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, PonziDepositModule, TypeOrmModule.forFeature([PonziRulesEntity])],
  providers: [PonziRulesService],
  controllers: [PonziRulesController],
  exports: [PonziRulesService],
})
export class PonziRulesModule {}
