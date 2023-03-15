import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IOrder, OrderStatus } from "@framework/types";
import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { OrderItemEntity } from "../order-item/order-item.entity";
import { AddressEntity } from "../address/address.entity";
import { MerchantEntity } from "../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "order" })
export class OrderEntity extends IdDateBaseEntity implements IOrder {
  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @ManyToOne(_type => MerchantEntity, merchant => merchant.orders)
  public merchant: MerchantEntity;

  @OneToMany(_type => OrderItemEntity, item => item.order, {
    eager: true,
    cascade: ["remove", "insert"],
  })
  public items: Array<OrderItemEntity>;

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  public orderStatus: OrderStatus;

  @JoinColumn()
  @OneToOne(_type => AddressEntity)
  public address: AddressEntity;

  @Column({ type: "int" })
  public addressId: number;

  @Column({ type: "boolean" })
  public isArchived: boolean;
}
