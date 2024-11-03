import { Module } from "@nestjs/common";

import { VestingBoxModule } from "./box/box.module";
import { VestingContractModule } from "./contract/contract.module";
import { VestingTokenModule } from "./token/token.module";

@Module({
  imports: [VestingContractModule, VestingBoxModule, VestingTokenModule],
})
export class VestingModule {}
