import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeService } from "./exchange.service";
import { ExchangeEntity } from "./exchange.entity";
import { ExchangeController } from "./exchange.controller";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([ExchangeEntity])],
  providers: [ExchangeService],
  controllers: [ExchangeController],
  exports: [ExchangeService],
})
export class ExchangeModule {}
