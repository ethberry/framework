import { Module } from "@nestjs/common";

import { CoreModule } from "./core/core.module";
import { ClaimModule } from "./claim/claim.module";

@Module({
  imports: [CoreModule, ClaimModule],
})
export class ExchangeModule {}
