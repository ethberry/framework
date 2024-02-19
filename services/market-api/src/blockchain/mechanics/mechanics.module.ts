import { Module } from "@nestjs/common";

import { GamingMechanicsModule } from "./gaming/gaming.module";
import { GamblingMechanicsModule } from "./gambling/gambling.module";

@Module({
  imports: [
    GamingMechanicsModule,
    GamblingMechanicsModule,
    GamblingMechanicsModule,
    GamblingMechanicsModule,
  ],
})
export class MechanicsModule {}
