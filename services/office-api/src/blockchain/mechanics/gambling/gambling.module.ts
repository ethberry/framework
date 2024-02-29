import { Module } from "@nestjs/common";

import { PonziModule } from "./ponzi/ponzi.module";

@Module({
  imports: [PonziModule],
})
export class GamblingMechanicsModule {}
