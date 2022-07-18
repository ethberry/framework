import { Logger, Module } from "@nestjs/common";

import { MarketplaceService } from "./marketplace.service";
import { MarketplaceController } from "./marketplace.controller";
import { SignerModule } from "../signer/signer.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [SignerModule, TemplateModule],
  providers: [Logger, MarketplaceService],
  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
