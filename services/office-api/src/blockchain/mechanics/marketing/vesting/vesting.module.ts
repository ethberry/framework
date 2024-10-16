import { Module } from "@nestjs/common";

import { VestingContractModule } from "./contract/contract.module";

@Module({
  imports: [VestingContractModule],
})
export class VestingModule {}
