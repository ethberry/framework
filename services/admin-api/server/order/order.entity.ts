import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { IOrder, OrderStatus } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants-misc";

import { UserEntity } from "../user/user.entity";
import { MerchantEntity } from "../merchant/merchant.entity";
import { BaseEntity } from "../common/base.entity";
import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "order" })
export class OrderEntity extends BaseEntity implements IOrder {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @Column({ type: "int" })
  public productId: number;

  @JoinColumn()
  @ManyToOne(_type => ProductEntity, product => product.orders)
  public product: ProductEntity;

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  public orderStatus: OrderStatus;

  @Column({ type: "int" })
  public price: number;
}
