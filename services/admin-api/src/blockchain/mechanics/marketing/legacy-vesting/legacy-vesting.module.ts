import { Module } from "@nestjs/common";

import { LegacyVestingContractModule } from "./contract/contract.module";

@Module({
  imports: [LegacyVestingContractModule],
})
export class LegacyVestingModule {}
