import { Module } from "@nestjs/common";

import { GradeModule } from "./grade/grade.module";

@Module({
  imports: [GradeModule],
})
export class GamingMechanicsModule {}
