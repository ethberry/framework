import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeRulesService } from "./exchange-rules.service";
import { ExchangeRulesController } from "./exchange-rules.controller";
import { ExchangeRulesEntity } from "./exchange-rules.entity";
import { AssetModule } from "../../../blockchain/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([ExchangeRulesEntity])],
  providers: [ExchangeRulesService],
  controllers: [ExchangeRulesController],
  exports: [ExchangeRulesService],
})
export class ExchangeRulesModule {}
