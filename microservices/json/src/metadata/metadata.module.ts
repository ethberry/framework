import { Module } from "@nestjs/common";

import { Erc1155TokenModule } from "./token/token.module";
import { MetadataContractModule } from "./contract/contract.module";

@Module({
  imports: [MetadataContractModule, Erc1155TokenModule],
})
export class MetadataModule {}
