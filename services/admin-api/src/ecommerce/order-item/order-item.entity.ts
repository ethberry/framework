import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IOrderItem } from "@framework/types";
import { ns } from "@framework/constants";

import { OrderEntity } from "../order/order.entity";
import { ProductItemEntity } from "../product-item/product-item.entity";
import { AssetComponentHistoryEntity } from "../../blockchain/exchange/asset/asset-component-history.entity";

@Entity({ schema: ns, name: "order_item" })
export class OrderItemEntity extends IdDateBaseEntity implements IOrderItem {
  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public productItemId: number;

  @JoinColumn()
  @ManyToOne(_type => ProductItemEntity, productItem => productItem.orderItems, {
    eager: true,
  })
  public productItem: ProductItemEntity;

  @Column({ type: "int" })
  public orderId: number;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;

  @JoinColumn()
  @ManyToOne(_type => OrderEntity, order => order.orderItems)
  public order: OrderEntity;
}
