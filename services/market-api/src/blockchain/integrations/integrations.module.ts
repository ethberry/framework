import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { InfuraModule } from "./infura/infura.module";
import { OpenSeaModule } from "./open-sea/open-sea.module";

@Module({
  imports: [ChainLinkModule, InfuraModule, OpenSeaModule],
})
export class IntegrationsModule {}
