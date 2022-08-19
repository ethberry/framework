import { Module } from "@nestjs/common";

import { MysteryboxContractModule } from "./contract/contract.module";
import { MysteryboxTokenModule } from "./token/token.module";
import { MysteryboxBoxModule } from "./mysterybox/mysterybox.module";
import { MysteryboxSignModule } from "./sign/sign.module";

@Module({
  imports: [MysteryboxContractModule, MysteryboxBoxModule, MysteryboxTokenModule, MysteryboxSignModule],
})
export class MysteryboxModule {}
