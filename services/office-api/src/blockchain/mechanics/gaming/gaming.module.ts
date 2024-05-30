import { Module } from "@nestjs/common";

import { DiscreteModule } from "./discrete/discrete.module";

@Module({
  imports: [DiscreteModule],
})
export class GamingMechanicsModule {}
