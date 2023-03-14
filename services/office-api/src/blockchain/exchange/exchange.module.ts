import { Module } from "@nestjs/common";

import { PayeesModule } from "./payees/payees.module";

@Module({
  imports: [PayeesModule],
})
export class ExchangeModule {}
