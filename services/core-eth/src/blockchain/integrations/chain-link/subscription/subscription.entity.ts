import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IChainLinkSubscription } from "@framework/types";
import { ns } from "@framework/constants";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "chain_link_subscriptions" })
export class ChainLinkSubscriptionEntity extends IdDateBaseEntity implements IChainLinkSubscription {
  @Column({ type: "int" })
  public merchantId: number;

  @Column({ type: "int" })
  public chainId: number;

  @Column({ type: "int" })
  public vrfSubId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.chainLinkSubscriptions)
  public merchant: MerchantEntity;
}
