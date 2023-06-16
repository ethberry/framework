import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { WaitListModule } from "./waitlist/waitlist.module";

@Module({
  imports: [ClaimModule, WaitListModule],
})
export class MechanicsModule {}
