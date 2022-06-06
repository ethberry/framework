import { Module } from "@nestjs/common";

import { Erc20VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [Erc20VestingModule],
})
export class VestingModule {}
