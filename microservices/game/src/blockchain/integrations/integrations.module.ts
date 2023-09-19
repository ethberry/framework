import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";

@Module({
  imports: [ChainLinkModule],
})
export class IntegrationsModule {}
