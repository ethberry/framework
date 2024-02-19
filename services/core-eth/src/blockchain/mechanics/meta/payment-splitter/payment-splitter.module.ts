import { Module } from "@nestjs/common";

import { PaymentSplitterLogModule } from "./log/log.module";

@Module({
  imports: [PaymentSplitterLogModule],
})
export class PaymentSplitterModule {}
