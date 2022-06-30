import { Module } from "@nestjs/common";

import { UniTemplateModule } from "./uni-template/uni-template.module";

@Module({
  imports: [UniTemplateModule],
})
export class UniModule {}
