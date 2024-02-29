import { Module } from "@nestjs/common";

import { AssetPromoModule } from "./promo/promo.module";

@Module({
  imports: [AssetPromoModule],
})
export class MetaMechanicsModule {}
