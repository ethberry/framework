import { Module } from "@nestjs/common";

import { Erc721ContractModule } from "./contract/contract.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721MarketplaceModule } from "./marketplace/marketplace.module";
import { AirdropModule } from "../mechanics/airdrop/airdrop.module";

@Module({
  imports: [AirdropModule, Erc721ContractModule, Erc721MarketplaceModule, Erc721TemplateModule, Erc721TokenModule],
})
export class Erc721Module {}
