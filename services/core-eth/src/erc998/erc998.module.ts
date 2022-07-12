import { Module } from "@nestjs/common";

import { Erc998TokenModule } from "./token/token.module";

@Module({
  imports: [Erc998TokenModule],
})
export class Erc998Module {}
