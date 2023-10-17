import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { AssetPromoEntity } from "./promo.entity";
import { AssetPromoService } from "./promo.service";
import { AssetPromoController } from "./promo.controller";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TemplateModule, TypeOrmModule.forFeature([AssetPromoEntity])],
  providers: [Logger, AssetPromoService],
  controllers: [AssetPromoController],
  exports: [AssetPromoService],
})
export class AssetPromoModule {}
