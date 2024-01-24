import { Module } from "@nestjs/common";

import { ClaimTemplateModule } from "./template/template.module";
import { ClaimTokenModule } from "./token/token.module";

@Module({
  imports: [ClaimTemplateModule, ClaimTokenModule],
})
export class ClaimModule {}
