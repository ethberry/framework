import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";

@Module({
  imports: [ClaimModule],
})
export class MechanicsModule {}
