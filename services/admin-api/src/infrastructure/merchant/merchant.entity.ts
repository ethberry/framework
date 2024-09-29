import { Column, Entity, OneToMany } from "typeorm";

import type { IMerchant, IMerchantSocial } from "@framework/types";
import { MerchantStatus, RatePlanType } from "@framework/types";
import { ns } from "@framework/constants";
import { SearchableEntity } from "@ethberry/nest-js-module-typeorm-postgres";

import { UserEntity } from "../user/user.entity";
import { OrderEntity } from "../../ecommerce/order/order.entity";
import { ProductEntity } from "../../ecommerce/product/product.entity";
import { ChainLinkSubscriptionEntity } from "../../blockchain/integrations/chain-link/subscription/subscription.entity";
import { ReferralProgramEntity } from "../../blockchain/mechanics/meta/referral/program/referral.program.entity";

@Entity({ schema: ns, name: "merchant" })
export class MerchantEntity extends SearchableEntity implements IMerchant {
  @Column({ type: "varchar" })
  public email: string;

  @Column({ type: "varchar" })
  public phoneNumber: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public wallet: string;

  @Column({
    type: "varchar",
    select: false,
  })
  public apiKey: string;

  @Column({
    type: "enum",
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;

  @Column({ type: "json" })
  public social: IMerchantSocial;

  @Column({
    type: "enum",
    enum: RatePlanType,
  })
  public ratePlan: RatePlanType;

  @OneToMany(_type => UserEntity, user => user.merchant)
  public users: Array<UserEntity>;

  @OneToMany(_type => ProductEntity, product => product.merchant, {
    cascade: ["remove"],
  })
  public products: Array<ProductEntity>;

  @OneToMany(_type => OrderEntity, order => order.merchant, {
    cascade: ["remove"],
  })
  public orders: Array<OrderEntity>;

  @OneToMany(_type => ChainLinkSubscriptionEntity, sub => sub.merchant)
  public chainLinkSubscriptions: Array<ChainLinkSubscriptionEntity>;

  @OneToMany(_type => ReferralProgramEntity, ref => ref.merchant)
  public refLevels: Array<ReferralProgramEntity>;
}
