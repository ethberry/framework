import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeService } from "./exchange.service";
import { ExchangeController } from "./exchange.controller";
import { ExchangeEntity } from "./exchange.entity";
import { AssetModule } from "../../blockchain/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([ExchangeEntity])],
  providers: [ExchangeService],
  controllers: [ExchangeController],
  exports: [ExchangeService],
})
export class ExchangeModule {}
