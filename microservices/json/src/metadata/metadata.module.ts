import { Module } from "@nestjs/common";

import { MetadataTokenModule } from "./token/token.module";
import { MetadataContractModule } from "./contract/contract.module";

@Module({
  imports: [MetadataContractModule, MetadataTokenModule],
})
export class MetadataModule {}
