import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { WaitListModule } from "./wait-list/waitlist.module";

@Module({
  imports: [ClaimModule, WaitListModule],
})
export class MechanicsModule {}
