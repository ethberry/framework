import { Module } from "@nestjs/common";

import { Erc998TemplateModule } from "./template/template.module";
import { Erc998TokenModule } from "./token/token.module";
import { Erc998MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [Erc998TemplateModule, Erc998TokenModule, Erc998MarketplaceModule],
})
export class Erc998Module {}
