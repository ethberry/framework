import { Module } from "@nestjs/common";

import { MysteryContractModule } from "./contract/contract.module";
import { MysteryTokenModule } from "./token/token.module";
import { MysteryBoxModule } from "./box/box.module";
import { MysterySignModule } from "./sign/sign.module";

@Module({
  imports: [MysteryContractModule, MysteryBoxModule, MysteryTokenModule, MysterySignModule],
})
export class MysteryModule {}
