import { Module } from "@nestjs/common";

import { NativeContractModule } from "./contract/contract.module";

@Module({
  imports: [NativeContractModule],
})
export class NativeModule {}
