import { Module } from "@nestjs/common";

import { RentTokenModule } from "./token/token.module";
import { RentSignModule } from "./sign/sign.module";

@Module({
  imports: [RentTokenModule, RentSignModule],
})
export class RentModule {}
