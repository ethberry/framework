import { Module } from "@nestjs/common";

import { CollectionTemplateModule } from "./template/template.module";
import { CollectionContractModule } from "./contract/contract.module";
import { CollectionTokenModule } from "./token/token.module";

@Module({
  imports: [CollectionContractModule, CollectionTemplateModule, CollectionTokenModule],
})
export class MysteryModule {}
