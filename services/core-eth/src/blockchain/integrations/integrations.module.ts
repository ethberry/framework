import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { OpenSeaModule } from "./opensea/opensea.module";

@Module({
  imports: [OpenSeaModule, ChainLinkModule],
})
export class IntegrationsModule {}
