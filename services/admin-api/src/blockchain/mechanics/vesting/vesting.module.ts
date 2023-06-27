import { Module } from "@nestjs/common";

import { VestingContractModule } from "./contract/contract.module";
import { VestingClaimModule } from "./claim/claim.module";

@Module({
  imports: [VestingContractModule, VestingClaimModule],
})
export class VestingModule {}
