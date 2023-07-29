import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChainLinkSubscriptionEntity } from "./subscription.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChainLinkSubscriptionEntity])],
})
export class ChainLinkSubscriptionModule {}
