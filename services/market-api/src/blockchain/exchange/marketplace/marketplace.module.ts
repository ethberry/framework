import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [SettingsModule, SignerModule, TemplateModule],
  providers: [Logger, MarketplaceService],
  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
