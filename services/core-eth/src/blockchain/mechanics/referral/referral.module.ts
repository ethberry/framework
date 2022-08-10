import { Module } from "@nestjs/common";

import { ReferralHistoryModule } from "./hystory/hystory.module";

@Module({
  imports: [ReferralHistoryModule],
})
export class ReferralModule {}
