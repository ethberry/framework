import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { WaitListModule } from "./wait-list/waitlist.module";
import { CraftModule } from "./craft/craft.module";

@Module({
  imports: [ClaimModule, CraftModule, WaitListModule],
})
export class MechanicsModule {}
