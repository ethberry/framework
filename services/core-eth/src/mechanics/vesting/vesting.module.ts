import { Module } from "@nestjs/common";

import { VestingModule as VModule } from "./vesting/vesting.module";

@Module({
  imports: [VModule],
})
export class VestingModule {}
