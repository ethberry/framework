import { Module } from "@nestjs/common";

import { Erc20VestingLogModule } from "./vesting-logs/vesting-log.module";
import { Erc20VestingModule } from "./vesting/vesting.module";

@Module({
  imports: [Erc20VestingModule, Erc20VestingLogModule],
})
export class VestingModule {}
