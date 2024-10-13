import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [ConfigModule, SettingsModule, SignerModule, TemplateModule, ContractModule],
  providers: [Logger, MarketplaceService],
  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
