import { Module } from "@nestjs/common";

import { OpenSeaModule } from "./opensea/opensea.module";

@Module({
  imports: [OpenSeaModule],
})
export class IntegrationsModule {}
