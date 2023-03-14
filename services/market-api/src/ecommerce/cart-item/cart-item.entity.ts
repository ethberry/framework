import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ICartItem } from "@framework/types";
import { ns } from "@framework/constants";

import { ProductEntity } from "../product/product.entity";
import { CartEntity } from "../cart/cart.entity";

@Entity({ schema: ns, name: "cart_item" })
export class CartItemEntity extends IdDateBaseEntity implements ICartItem {
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
  public cartId: number;

  @JoinColumn()
  @ManyToOne(_type => CartEntity, cart => cart.items)
  public cart: CartEntity;
}
