import { Column, Entity, OneToMany } from "typeorm";

import type { IMerchant } from "@framework/types";
import { MerchantStatus, RatePlan } from "@framework/types";
import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { UserEntity } from "../user/user.entity";
import { OrderEntity } from "../../ecommerce/order/order.entity";
import { ProductEntity } from "../../ecommerce/product/product.entity";

@Entity({ schema: ns, name: "merchant" })
export class MerchantEntity extends SearchableEntity implements IMerchant {
  @Column({ type: "varchar" })
  public email: string;

  @Column({ type: "varchar" })
  public phoneNumber: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public apiKey: string;

  @Column({
    type: "enum",
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;

  @Column({
    type: "enum",
    enum: RatePlan,
  })
  public ratePlan: RatePlan;

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
}
