import { Module } from "@nestjs/common";

import { PyramidRulesModule } from "./rules/rules.module";
import { PyramidStakesModule } from "./stakes/stakes.module";

@Module({
  imports: [PyramidRulesModule, PyramidStakesModule],
})
export class PyramidModule {}
