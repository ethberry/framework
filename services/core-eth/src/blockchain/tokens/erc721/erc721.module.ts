import { Module } from "@nestjs/common";

import { Erc721TokenModule } from "./token/token.module";
import { ClaimModule } from "../../../mechanics/claim/claim.module";

@Module({
  imports: [ClaimModule, Erc721TokenModule],
})
export class Erc721Module {}
