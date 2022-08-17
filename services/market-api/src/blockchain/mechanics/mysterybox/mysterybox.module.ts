import { Module } from "@nestjs/common";

import { MysteryboxContractModule } from "./contract/contract.module";
import { MysteryboxTemplateModule } from "./template/template.module";
import { MysteryboxTokenModule } from "./token/token.module";

@Module({
  imports: [MysteryboxContractModule, MysteryboxTemplateModule, MysteryboxTokenModule],
})
export class MysteryboxModule {}
