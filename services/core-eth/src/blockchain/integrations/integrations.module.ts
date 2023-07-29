import { Module } from "@nestjs/common";

import { ChainLinkContractModule } from "./chain-link/contract/contract.module";
import { OpenSeaModule } from "./opensea/opensea.module";

@Module({
  imports: [OpenSeaModule, ChainLinkContractModule],
})
export class IntegrationsModule {}
