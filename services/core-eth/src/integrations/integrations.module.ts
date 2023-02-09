import { Module } from "@nestjs/common";

import { OpenSeaModule } from "./opensea/opensea.module";
import { ChainLinkModule } from "./chain-link/chain-link.module";

@Module({
  imports: [OpenSeaModule, ChainLinkModule],
})
export class IntegrationsModule {}
