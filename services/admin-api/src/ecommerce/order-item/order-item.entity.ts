import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IOrderItem } from "@framework/types";
import { ns } from "@framework/constants";

import { OrderEntity } from "../order/order.entity";
import { ProductEntity } from "../product/product.entity";

@Entity({ schema: ns, name: "order_item" })
export class OrderItemEntity extends IdDateBaseEntity implements IOrderItem {
  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public productId: number;

  @JoinColumn()
  @ManyToOne(_type => ProductEntity, product => product.items, {
    eager: true,
  })
  public product: ProductEntity;

  @Column({ type: "int" })
  public orderId: number;

  @JoinColumn()
  @ManyToOne(_type => OrderEntity, order => order.items)
  public order: OrderEntity;
}
