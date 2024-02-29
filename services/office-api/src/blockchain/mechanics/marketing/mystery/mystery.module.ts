import { Module } from "@nestjs/common";

import { MysteryBoxModule } from "./box/box.module";
import { MysteryContractModule } from "./contract/contract.module";
import { MysteryTokenModule } from "./token/token.module";

@Module({
  imports: [MysteryContractModule, MysteryBoxModule, MysteryTokenModule],
})
export class MysteryModule {}
