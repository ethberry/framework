import { Module } from "@nestjs/common";

import { VestingBoxModule } from "./box/box.module";
import { VestingSignModule } from "./sign/sign.module";

@Module({
  imports: [VestingBoxModule, VestingSignModule],
})
export class VestingModule {}
