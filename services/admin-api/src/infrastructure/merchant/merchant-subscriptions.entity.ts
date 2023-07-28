import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import type { IMerchantSubscriptions } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { MerchantEntity } from "./merchant.entity";

@Entity({ schema: ns, name: "merchant_subscriptions" })
export class MerchantSubscriptionsEntity extends IdDateBaseEntity implements IMerchantSubscriptions {
  @Column({ type: "int" })
  public merchantId: number;

  @Column({ type: "int" })
  public chainId: number;

  @Column({ type: "int" })
  public vrfSubId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.subscriptions)
  public merchant: MerchantEntity;
}
