import { Module } from "@nestjs/common";

import { WrapperTokenModule } from "./token/token.module";

@Module({
  imports: [WrapperTokenModule],
})
export class WrapperModule {}
