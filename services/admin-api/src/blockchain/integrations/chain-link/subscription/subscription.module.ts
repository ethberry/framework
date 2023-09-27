import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ChainLinkSubscriptionEntity } from "./subscription.entity";
import { ChainLinkSubscriptionService } from "./subscription.service";
import { ChainLinkSubscriptionController } from "./subscription.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ChainLinkSubscriptionEntity])],
  controllers: [ChainLinkSubscriptionController],
  providers: [ChainLinkSubscriptionService],
  exports: [ChainLinkSubscriptionService],
})
export class ChainLinkSubscriptionModule {}
