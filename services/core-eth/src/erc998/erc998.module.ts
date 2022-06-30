import { Module } from "@nestjs/common";

import { Erc998CoontractModule } from "./contract/contract.module";
import { Erc998TokenModule } from "./token/token.module";
import { Erc998TemplateModule } from "./template/template.module";
import { Erc998MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [Erc998CoontractModule, Erc998MarketplaceModule, Erc998TemplateModule, Erc998TokenModule],
})
export class Erc998Module {}
