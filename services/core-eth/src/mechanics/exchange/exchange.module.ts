import { Module } from "@nestjs/common";

import { ExchangeRulesModule } from "./exchange-rules/exchange-rules.module";

@Module({
  imports: [ExchangeRulesModule],
})
export class ExchangeModule {}
