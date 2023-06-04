import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ICartItem } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductItemEntity } from "../product-item/product-item.entity";
import { CartEntity } from "../cart/cart.entity";

@Entity({ schema: ns, name: "cart_item" })
export class CartItemEntity extends IdDateBaseEntity implements ICartItem {
  @Column({ type: "int" })
  public quantity: number;

  @Column({ type: "int" })
  public productItemId: number;

  @JoinColumn()
  @ManyToOne(_type => ProductItemEntity, {
    eager: true,
  })
  public productItem: ProductItemEntity;

  @Column({ type: "int" })
  public cartId: number;

  @JoinColumn()
  @ManyToOne(_type => CartEntity, cart => cart.items)
  public cart: CartEntity;
}
