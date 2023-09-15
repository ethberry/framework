import { Module } from "@nestjs/common";

import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";
import { PauseModule } from "./pause/pause.module";
import { PaymentSplitterModule } from "./payment-splitter/payment-splitter.module";
import { RentModule } from "./rent/rent.module";
import { RoyaltyModule } from "./royalty/royalty.module";

@Module({
  imports: [AccessControlModule, AccessListModule, PauseModule, PaymentSplitterModule, RentModule, RoyaltyModule],
})
export class ExtensionsModule {}
