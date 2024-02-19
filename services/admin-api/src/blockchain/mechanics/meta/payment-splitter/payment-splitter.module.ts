import { Module } from "@nestjs/common";

import { PaymentSplitterContractModule } from "./contract/contract.module";

@Module({
  imports: [PaymentSplitterContractModule],
})
export class PaymentSplitterModule {}
