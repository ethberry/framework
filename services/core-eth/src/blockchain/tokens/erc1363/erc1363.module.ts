import { Module } from "@nestjs/common";

import { Erc1363TokenModule } from "./token/token.module";

@Module({
  imports: [Erc1363TokenModule],
})
export class Erc1363Module {}
